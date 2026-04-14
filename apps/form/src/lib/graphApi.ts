const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'
const BATCH_URL = `${GRAPH_BASE_URL}/$batch`
const BATCH_SIZE = 20 // Max requests per $batch call (MS Graph limit)
const BATCH_CONCURRENCY = 4 // Max parallel $batch calls to avoid throttling
const CACHE_KEY = 'ms-graph-users-cache-v3'
const CACHE_STORAGE = localStorage
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 1 week
const NEGATIVE_CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const RETRY_DELAY_CAP_MS = 10_000

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

type BatchRequest = {
  id: string
  method: string
  url: string
}

type BatchResponseItem = {
  id: string
  status: number
  headers?: Record<string, string>
  body: {
    id?: string
    displayName?: string
    mail?: string | null
    error?: unknown
  }
}

type BatchResult = {
  users: MsGraphUser[]
  succeededRequestIds: string[]
}

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
  successfullyQueriedIds: string[],
): void {
  const cache = loadCache()
  const now = Date.now()

  for (const [id, user] of fetchedUsers) {
    cache.set(id, { user, fetchedAt: now })
  }

  // Negative cache: only for IDs from SUCCESSFUL queries (200/404) that returned no user.
  // IDs from failed requests (429, 500, etc.) are NOT negative-cached.
  const queriedSet = new Set(successfullyQueriedIds)
  for (const id of queriedSet) {
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
      ({ found, successfullyQueriedIds }) => {
        saveToCache(found, successfullyQueriedIds)
        return found
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

function parseRetryAfter(headers?: Record<string, string>): number {
  const ra = headers?.['Retry-After'] ?? headers?.['retry-after']
  if (!ra) return 0
  const seconds = parseInt(ra, 10)
  return Number.isNaN(seconds) ? 0 : seconds * 1000
}

async function executeBatch(
  accessToken: string,
  requests: BatchRequest[],
): Promise<BatchResult> {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({ requests })

  let res: Response = await fetch(BATCH_URL, { method: 'POST', headers, body })

  // Retry if the $batch POST itself is throttled (429)
  if (res.status === 429) {
    const ra = res.headers.get('Retry-After')
    const delay = Math.min(ra ? parseInt(ra, 10) * 1000 : 2000, RETRY_DELAY_CAP_MS)
    await new Promise((resolve) => setTimeout(resolve, delay))
    res = await fetch(BATCH_URL, { method: 'POST', headers, body })
  }

  if (!res.ok) return { users: [], succeededRequestIds: [] }

  const json: { responses?: BatchResponseItem[] } = await res.json()
  const responses: BatchResponseItem[] = json.responses ?? []
  const users: MsGraphUser[] = []
  const succeededRequestIds: string[] = []
  const retryRequests: BatchRequest[] = []
  let retryAfterMs = 0

  for (const response of responses) {
    if (response.status === 200) {
      succeededRequestIds.push(response.id)
      if (response.body.id && response.body.displayName !== undefined) {
        users.push({
          id: response.body.id,
          displayName: response.body.displayName,
          mail: response.body.mail ?? null,
        })
      }
    } else if (response.status === 404) {
      succeededRequestIds.push(response.id)
    } else if (response.status === 429) {
      const original = requests.find((r) => r.id === response.id)
      if (original) retryRequests.push(original)
      retryAfterMs = Math.max(retryAfterMs, parseRetryAfter(response.headers))
    }
  }

  // Retry individual 429 responses once
  if (retryRequests.length > 0) {
    const delay = Math.min(retryAfterMs || 2000, RETRY_DELAY_CAP_MS)
    await new Promise((resolve) => setTimeout(resolve, delay))

    const retryRes = await fetch(BATCH_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ requests: retryRequests }),
    })

    if (retryRes.ok) {
      const retryJson = await retryRes.json()
      const retryResponses: BatchResponseItem[] = retryJson.responses ?? []
      for (const response of retryResponses) {
        if (response.status === 200) {
          succeededRequestIds.push(response.id)
          if (response.body.id && response.body.displayName !== undefined) {
            users.push({
              id: response.body.id,
              displayName: response.body.displayName,
              mail: response.body.mail ?? null,
            })
          }
        } else if (response.status === 404) {
          succeededRequestIds.push(response.id)
        }
      }
    }
  }

  return { users, succeededRequestIds }
}

async function executeBatchesConcurrently(
  accessToken: string,
  batches: BatchRequest[][],
): Promise<BatchResult[]> {
  const results: BatchResult[] = []

  for (let i = 0; i < batches.length; i += BATCH_CONCURRENCY) {
    const group = batches.slice(i, i + BATCH_CONCURRENCY)
    const groupResults = await Promise.allSettled(
      group.map((batch) => executeBatch(accessToken, batch)),
    )
    for (const result of groupResults) {
      results.push(
        result.status === 'fulfilled'
          ? result.value
          : { users: [], succeededRequestIds: [] },
      )
    }
  }

  return results
}

async function fetchMsGraphUsers(
  accessToken: string,
  microsoftUserIds: string[],
): Promise<{ found: Map<string, MsGraphUser>; successfullyQueriedIds: string[] }> {
  const found = new Map<string, MsGraphUser>()
  const successfullyQueriedIds: string[] = []

  if (microsoftUserIds.length === 0) return { found, successfullyQueriedIds }

  const unique = [...new Set(microsoftUserIds)]

  // Build one GET /users/{id} request per user (User.ReadBasic.All compatible)
  const allRequests: BatchRequest[] = unique.map((userId, index) => ({
    id: String(index),
    method: 'GET',
    url: `/users/${userId}?$select=id,displayName,mail`,
  }))

  // Split into batches of BATCH_SIZE (max 20 requests per $batch call)
  const batches: BatchRequest[][] = []
  for (let i = 0; i < allRequests.length; i += BATCH_SIZE) {
    batches.push(allRequests.slice(i, i + BATCH_SIZE))
  }

  // Execute batches with concurrency control
  const results = await executeBatchesConcurrently(accessToken, batches)

  for (const result of results) {
    for (const user of result.users) {
      found.set(user.id, user)
    }
    for (const reqId of result.succeededRequestIds) {
      const index = parseInt(reqId, 10)
      if (unique[index]) {
        successfullyQueriedIds.push(unique[index])
      }
    }
  }

  return { found, successfullyQueriedIds }
}
