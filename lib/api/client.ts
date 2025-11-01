import { API_CONFIG, getAuthToken } from "./config"

export class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    console.log("[v0] API Client initialized with base URL:", this.baseURL)
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken()

    const headers: HeadersInit = {
      ...options.headers,
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    const fullURL = `${this.baseURL}${endpoint}`
    console.log("[v0] Fetching from external API:", fullURL)

    try {
      const response = await fetch(fullURL, {
        ...options,
        headers,
      })

      console.log("[v0] Response status:", response.status, response.statusText)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }))
        console.error("[v0] API request failed:", error)
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Response data structure:", {
        isArray: Array.isArray(data),
        keys: typeof data === "object" ? Object.keys(data) : "not an object",
        dataLength: Array.isArray(data)
          ? data.length
          : data?.data?.length || data?.products?.length || data?.categories?.length || "unknown",
      })

      return data
    } catch (error) {
      console.error("[v0] API request error:", error)
      console.error("[v0] Make sure your backend is running at:", this.baseURL)
      throw error
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    return this.request<{ token: string; user: any }>(API_CONFIG.endpoints.login, {
      method: "POST",
      body: formData,
    })
  }

  async getUser() {
    return this.request<{ user: any }>(API_CONFIG.endpoints.user)
  }

  async logout() {
    return this.request(API_CONFIG.endpoints.logout, {
      method: "POST",
    })
  }

  // Products methods
  async getProducts() {
    return this.request<{ products: any[] }>(API_CONFIG.endpoints.products)
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(API_CONFIG.endpoints.product(id))
  }

  // Categories methods
  async getCategories() {
    return this.request<{ categories: any[] }>(API_CONFIG.endpoints.categories)
  }

  async getCategory(id: string) {
    return this.request<{ category: any }>(API_CONFIG.endpoints.category(id))
  }
}

export const apiClient = new APIClient()
