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

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }))
        console.error("[v0] API request failed:", error)
        if (error.errors) {
          const errorMessages = Object.entries(error.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("\n")
          throw new Error(errorMessages || error.message || `HTTP ${response.status}`)
        }
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Response data structure:", {
        isArray: Array.isArray(data),
        keys: typeof data === "object" ? Object.keys(data) : "not an object",
      })

      return data
    } catch (error) {
      console.error("[v0] API request error:", error)
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
  async getProducts(page?: number) {
    const endpoint = page ? `${API_CONFIG.endpoints.products}?page=${page}` : API_CONFIG.endpoints.products
    return this.request<{ products: any[] }>(endpoint)
  }

  async getAllProducts() {
    let allProducts: any[] = []
    const currentPage = 1
    let lastPage = 1

    try {
      // Fetch first page to get pagination info
      const firstPageData = await this.getProducts(1)
      console.log("[v0] First page response:", firstPageData)

      // Extract products and pagination metadata
      const products = firstPageData.data || firstPageData.products || []
      allProducts = [...products]

      // Get pagination metadata
      const meta = firstPageData.meta
      if (meta && meta.last_page) {
        lastPage = meta.last_page
        console.log("[v0] Total pages:", lastPage)

        // Fetch remaining pages
        for (let page = 2; page <= lastPage; page++) {
          const pageData = await this.getProducts(page)
          const pageProducts = pageData.data || pageData.products || []
          allProducts = [...allProducts, ...pageProducts]
          console.log(`[v0] Fetched page ${page}/${lastPage}, total products so far:`, allProducts.length)
        }
      }

      console.log("[v0] Total products fetched:", allProducts.length)

      return {
        data: allProducts,
        meta: {
          total: allProducts.length,
          current_page: 1,
          last_page: lastPage,
        },
      }
    } catch (error) {
      console.error("[v0] Error fetching all products:", error)
      throw error
    }
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(API_CONFIG.endpoints.product(id))
  }

  async createProduct(formData: FormData) {
    return this.request<{ product: any; message: string }>(API_CONFIG.endpoints.createProduct, {
      method: "POST",
      body: formData,
    })
  }

  async updateProduct(id: string, formData: FormData) {
    return this.request<{ product: any; message: string }>(API_CONFIG.endpoints.updateProduct(id), {
      method: "POST",
      body: formData,
    })
  }

  async deleteProduct(id: string) {
    return this.request<{ message: string }>(API_CONFIG.endpoints.deleteProduct(id), {
      method: "DELETE",
    })
  }

  // Categories methods
  async getCategories() {
    return this.request<{ categories: any[] }>(API_CONFIG.endpoints.categories)
  }

  async getCategory(id: string) {
    return this.request<{ category: any }>(API_CONFIG.endpoints.category(id))
  }

  async createCategory(formData: FormData) {
    return this.request<{ category: any; message: string }>(API_CONFIG.endpoints.createCategory, {
      method: "POST",
      body: formData,
    })
  }

  async updateCategory(id: string, formData: FormData) {
    return this.request<{ category: any; message: string }>(API_CONFIG.endpoints.updateCategory(id), {
      method: "POST",
      body: formData,
    })
  }

  async deleteCategory(id: string) {
    return this.request<{ message: string }>(API_CONFIG.endpoints.deleteCategory(id), {
      method: "DELETE",
    })
  }
}

export const apiClient = new APIClient()
