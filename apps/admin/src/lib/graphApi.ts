const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'
const CHUNK_SIZE = 15
const CACHE_KEY = 'ms-graph-users-cache-v2'
const CACHE_STORAGE = sessionStorage
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const NEGATIVE_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export type MsGraphUser = {
  id: string
  displayName: string
  mail: string | null
}

type CacheEntry = {
  user: MsGraphUser | null // null = negative cache
  fetchedAt: number
}

type CacheData = Record<string, CacheEntry>

let memoryCache: Map<string, CacheEntry> | null = null

function loadCache(): Map<string, CacheEntry> {
  if (memoryCache) return memoryCache
  try {
    const raw = CACHE_STORAGE.getItem(CACHE_KEY)
    if (raw) {
      const parsed: CacheData = JSON.parse(raw)
      memoryCache = new Map(Object.entries(parsed))
      return memoryCache
    }
  } catch {
    // localStorage access may fail
  }
  memoryCache = new Map()
  return memoryCache
}

function persistCache(): void {
  const cache = loadCache()
  try {
    const data: CacheData = Object.fromEntries(cache)
    CACHE_STORAGE.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // localStorage write may fail (quota exceeded, etc.)
  }
}

function isEntryValid(entry: CacheEntry): boolean {
  const age = Date.now() - entry.fetchedAt
  if (entry.user === null) return age < NEGATIVE_CACHE_TTL
  return age < CACHE_TTL
}

function getCachedUsers(
  ids: string[],
): { cached: Map<string, MsGraphUser>; uncachedIds: string[] } {
  const cache = loadCache()
  const cached = new Map<string, MsGraphUser>()
  const uncachedIds: string[] = []
  for (const id of ids) {
    const entry = cache.get(id)
    if (entry && isEntryValid(entry)) {
      if (entry.user) cached.set(id, entry.user)
      // negative cache: skip (don't add to uncachedIds)
    } else {
      uncachedIds.push(id)
    }
  }
  return { cached, uncachedIds }
}

function saveToCache(
  fetchedUsers: Map<string, MsGraphUser>,
  requestedIds: string[],
): void {
  const cache = loadCache()
  const now = Date.now()

  for (const [id, user] of fetchedUsers) {
    cache.set(id, { user, fetchedAt: now })
  }

  // Negative cache: IDs requested but not returned
  for (const id of requestedIds) {
    if (!fetchedUsers.has(id) && !cache.get(id)?.user) {
      cache.set(id, { user: null, fetchedAt: now })
    }
  }

  // Evict expired entries on write
  for (const [id, entry] of cache) {
    if (!isEntryValid(entry)) cache.delete(id)
  }

  persistCache()
}

const inflightRequests = new Map<string, Promise<MsGraphUser | null>>()

export async function resolveUsers(
  accessToken: string,
  ids: string[],
): Promise<Map<string, MsGraphUser>> {
  const { cached, uncachedIds } = getCachedUsers(ids)

  const needFetch: string[] = []
  const waitPromises: Promise<void>[] = []

  for (const id of uncachedIds) {
    const inflight = inflightRequests.get(id)
    if (inflight) {
      waitPromises.push(
        inflight.then((u) => {
          if (u) cached.set(u.id, u)
        }),
      )
    } else {
      needFetch.push(id)
    }
  }

  if (needFetch.length > 0) {
    const fetchPromise = fetchMsGraphUsers(accessToken, needFetch).then(
      (fetched) => {
        saveToCache(fetched, needFetch)
        return fetched
      },
    )

    for (const id of needFetch) {
      const singlePromise = fetchPromise.then(
        (fetched) => fetched.get(id) ?? null,
        () => null,
      )
      inflightRequests.set(id, singlePromise)
      singlePromise.finally(() => inflightRequests.delete(id))
    }

    waitPromises.push(
      fetchPromise.then((fetched) => {
        for (const [id, u] of fetched) {
          cached.set(id, u)
        }
      }),
    )
  }

  await Promise.all(waitPromises)
  return cached
}

export async function resolveUser(
  accessToken: string,
  id: string,
): Promise<MsGraphUser | null> {
  const result = await resolveUsers(accessToken, [id])
  return result.get(id) ?? null
}

async function fetchMsGraphUsers(
  accessToken: string,
  microsoftUserIds: string[],
): Promise<Map<string, MsGraphUser>> {
  const result = new Map<string, MsGraphUser>()
  if (microsoftUserIds.length === 0) return result

  const unique = [...new Set(microsoftUserIds)]

  const chunks: string[][] = []
  for (let i = 0; i < unique.length; i += CHUNK_SIZE) {
    chunks.push(unique.slice(i, i + CHUNK_SIZE))
  }

  const responses = await Promise.allSettled(
    chunks.map(async (chunk) => {
      const filter = chunk.map((id) => `'${id.replace(/'/g, "''")}'`).join(',')
      const params = new URLSearchParams({
        $filter: `id in (${filter})`,
        $select: 'id,displayName,mail',
      })
      const url = `${GRAPH_BASE_URL}/users?${params.toString()}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        console.error(`Graph API error: ${res.status} ${res.statusText}`)
        return []
      }
      const json = await res.json()
      return (json.value ?? []) as MsGraphUser[]
    }),
  )

  for (const response of responses) {
    if (response.status === 'fulfilled') {
      for (const user of response.value) {
        result.set(user.id, user)
      }
    }
  }

  return result
}

export async function resolveUsersByEmails(
  accessToken: string,
  emails: string[],
): Promise<Map<string, MsGraphUser>> {
  const result = new Map<string, MsGraphUser>()
  if (emails.length === 0) return result

  const unique = [...new Set(emails)]

  const chunks: string[][] = []
  for (let i = 0; i < unique.length; i += CHUNK_SIZE) {
    chunks.push(unique.slice(i, i + CHUNK_SIZE))
  }

  const responses = await Promise.allSettled(
    chunks.map(async (chunk) => {
      const filter = chunk.map((email) => `mail eq '${email.replace(/'/g, "''")}'`).join(' or ')
      const params = new URLSearchParams({
        $filter: filter,
        $select: 'id,displayName,mail',
      })
      const url = `${GRAPH_BASE_URL}/users?${params.toString()}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        console.error(`Graph API error: ${res.status} ${res.statusText}`)
        return []
      }
      const json = await res.json()
      return (json.value ?? []) as MsGraphUser[]
    }),
  )

  const byId = new Map<string, MsGraphUser>()
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      for (const user of response.value) {
        byId.set(user.id, user)
        if (user.mail) {
          result.set(user.mail.toLowerCase(), user)
        }
      }
    }
  }

  // Save fetched users to cache by ID
  if (byId.size > 0) {
    saveToCache(byId, [...byId.keys()])
  }

  return result
}
