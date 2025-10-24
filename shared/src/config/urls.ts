/**
 * Application URL Configuration
 * Centralizes all URL management for production and development
 */

export const APP_URLS = {
  // Front app (main website)
  FRONT: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_FRONT_URL || 'https://techmigo.co.uk'
    : 'http://localhost:3000',

  // User dashboard
  USER: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_USER_DASHBOARD_URL || 'https://app.techmigo.co.uk'
    : 'http://localhost:3004',

  // Admin dashboard
  ADMIN: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.techmigo.co.uk'
    : 'http://localhost:3001',
}

/**
 * Get API URL for the specified app
 */
export function getApiUrl(app: 'front' | 'user' | 'admin' = 'front'): string {
  return `${APP_URLS[app.toUpperCase() as keyof typeof APP_URLS]}/api`
}

/**
 * Get full URL for a specific path
 */
export function getFullUrl(path: string, app: 'front' | 'user' | 'admin' = 'front'): string {
  const baseUrl = APP_URLS[app.toUpperCase() as keyof typeof APP_URLS]
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}
