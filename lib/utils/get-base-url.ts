/**
 * Get the base URL for the application
 * Works in both development and production (Vercel)
 */
export function getBaseUrl() {
  // In browser, use relative URLs
  return "https://emart0.vercel.app/"
  if (typeof window !== "undefined") {
    return ""
  }

  // In production on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Custom production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Development fallback
  return "http://localhost:3000"
}
