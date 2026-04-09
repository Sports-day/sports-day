const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'
const CHUNK_SIZE = 15

export type MsGraphUser = {
  id: string
  displayName: string
  mail: string | null
}

export async function fetchMsGraphUsers(
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
      const filter = chunk.map((id) => `'${id}'`).join(',')
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

export async function fetchMsGraphUser(
  accessToken: string,
  microsoftUserId: string,
): Promise<MsGraphUser | null> {
  try {
    const params = new URLSearchParams({ $select: 'id,displayName,mail' })
    const url = `${GRAPH_BASE_URL}/users/${encodeURIComponent(microsoftUserId)}?${params.toString()}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
      console.error(`Graph API error: ${res.status} ${res.statusText}`)
      return null
    }
    return await res.json()
  } catch (e) {
    console.error('Graph API fetch failed:', e)
    return null
  }
}
