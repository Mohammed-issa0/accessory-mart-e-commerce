import { API_CONFIG, getAuthToken } from "./config"

export class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.baseURL
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

    try {
      const response = await fetch(fullURL, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Request failed" }))
        if (error.errors) {
          const errorMessages = Object.entries(error.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
            .join("\n")
          throw new Error(errorMessages || error.message || `HTTP ${response.status}`)
        }
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
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

  async register(data: {
    name: string
    email: string
    phone: string
    password: string
    password_confirmation: string
  }) {
    return this.request<{ token: string; user: any }>(API_CONFIG.endpoints.register, {
      method: "POST",
      body: JSON.stringify(data),
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
      const firstPageData = await this.getProducts(1)
      const products = firstPageData.data || firstPageData.products || []
      allProducts = [...products]

      const meta = firstPageData.meta
      if (meta && meta.last_page) {
        lastPage = meta.last_page

        for (let page = 2; page <= lastPage; page++) {
          const pageData = await this.getProducts(page)
          const pageProducts = pageData.data || pageData.products || []
          allProducts = [...allProducts, ...pageProducts]
        }
      }

      return {
        data: allProducts,
        meta: {
          total: allProducts.length,
          current_page: 1,
          last_page: lastPage,
        },
      }
    } catch (error) {
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

  // Customer methods
  async getCustomers(params?: {
    q?: string
    verified?: boolean
    sort_by?: string
    sort_order?: string
    page?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.q) queryParams.append("q", params.q)
    if (params?.verified !== undefined) queryParams.append("verified", params.verified ? "1" : "0")
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by)
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order)
    if (params?.page) queryParams.append("page", params.page.toString())

    const endpoint = queryParams.toString()
      ? `${API_CONFIG.endpoints.customers}?${queryParams.toString()}`
      : API_CONFIG.endpoints.customers

    return this.request<{ data: any[]; meta: any }>(endpoint)
  }

  async getCustomer(id: string) {
    return this.request<{ data: any }>(API_CONFIG.endpoints.customer(id))
  }

  // Attributes methods
  async getAttributes() {
    return this.request<{ data: any[] }>(API_CONFIG.endpoints.attributes)
  }

  async getAttribute(id: string) {
    return this.request<{ data: any }>(API_CONFIG.endpoints.attribute(id))
  }

  // Favorites methods
  async getFavorites() {
    return this.request<{ data: any[] }>(API_CONFIG.endpoints.favorites)
  }

  async toggleFavorite(productId: number) {
    return this.request<{ message: string; is_favorited: boolean }>(API_CONFIG.endpoints.toggleFavorite, {
      method: "POST",
      body: JSON.stringify({ product_id: productId }),
    })
  }

  async checkFavorite(productId: string) {
    return this.request<{ is_favorited: boolean }>(API_CONFIG.endpoints.checkFavorite(productId))
  }
}

export const apiClient = new APIClient()
