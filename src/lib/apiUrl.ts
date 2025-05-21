/**
 * Utility for resolving API URLs in both development and production environments
 */

export function getBaseUrl() {
  // Check if NEXT_PUBLIC_API_URL is set (for Vercel)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (configuredUrl) return configuredUrl;
  
  // For local development or client-side rendering
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side in development
  return 'http://localhost:3000';
}

export function getApiUrl(path: string) {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
} 