export const API_CONFIG = {
  // Default to https://ecommerce-api.wildfleet.net/api (real backend URL)
  // You can override this by setting NEXT_PUBLIC_EXTERNAL_API_URL or EXTERNAL_API_URL environment variable
  baseURL: "https://ecommerce-api.wildfleet.net/api",
  endpoints: {
    // Auth
    login: "/login",
    register: "/register", // Added register endpoint
    user: "/user",
    logout: "/logout",
    // Products
    products: "/products",
    product: (id: string) => `/products/${id}`,
    createProduct: "/admin/products",
    updateProduct: (id: string) => `/admin/products/${id}`,
    deleteProduct: (id: string) => `/admin/products/${id}`,
    // Categories
    categories: "/categories",
    category: (id: string) => `/categories/${id}`,
    createCategory: "/admin/categories",
    updateCategory: (id: string) => `/admin/categories/${id}`,
    deleteCategory: (id: string) => `/admin/categories/${id}`,
    // Customers
    customers: "/admin/customers",
    customer: (id: string) => `/admin/customers/${id}`,
    // Attributes
    attributes: "/attributes",
    attribute: (id: string) => `/attributes/${id}`,
    // Favorites
    favorites: "/favorites",
    toggleFavorite: "/favorites/toggle",
    checkFavorite: (id: string) => `/favorites/check/${id}`,
  },
}

export const isAPIConfigured = () => {
  return !!API_CONFIG.baseURL
}

export const getAPIBaseURL = () => {
  const url = API_CONFIG.baseURL
  console.log("[v0] Using API Base URL:", url)
  return url
}

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}
