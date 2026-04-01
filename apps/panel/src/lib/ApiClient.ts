const ApiUrl = import.meta.env.VITE_API_URL

const headers = {
  "Content-Type": "application/json",
}

async function fetchWithToken(url: string, options: RequestInit = {}) {
  const mergedOptions: RequestInit = {
    cache: "no-cache",
    credentials: "include",
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${ApiUrl}${url}`, mergedOptions)

    if (!response.ok) {
      switch (response.status) {
        case 401:
          break
        case 404:
          break
        default:
          console.log("== internal server error")
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Fetch error: ", error)
    throw error
  }
}

export type ApiClientType = {
  get: (url: string) => Promise<any>
  getWithParams: (url: string, params: any) => Promise<any>
  getWithOption: (url: string, option: RequestInit | undefined) => Promise<any>
  post: (url: string, data: any) => Promise<any>
  put: (url: string, data: any) => Promise<any>
  delete: (url: string) => Promise<any>
}

export const ApiClient = (): ApiClientType => {
  return {
    get: (url: string) => fetchWithToken(url, { method: "GET" }),
    getWithParams: (url: string, params: any) => {
      const query = new URLSearchParams(params).toString()
      return fetchWithToken(`${url}?${query}`, { method: "GET" })
    },
    getWithOption: (url: string, option: RequestInit | undefined = {}) =>
      fetchWithToken(url, { method: "GET", ...option }),
    post: (url: string, data: any) =>
      fetchWithToken(url, { method: "POST", body: JSON.stringify(data) }),
    put: (url: string, data: any) =>
      fetchWithToken(url, { method: "PUT", body: JSON.stringify(data) }),
    delete: (url: string) => fetchWithToken(url, { method: "DELETE" }),
  }
}
