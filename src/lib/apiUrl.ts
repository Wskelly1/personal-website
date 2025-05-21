/**
 * Utility for resolving API URLs in both development and production environments
 */

export function getBaseUrl() {
  // For Vercel deployment - try NEXT_PUBLIC_API_URL first
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (configuredUrl) return configuredUrl;
  
  // Try NEXTAUTH_URL as fallback (commonly set in NextAuth setups)
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl) return nextAuthUrl;
  
  // For client-side rendering
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Important: For production server-side rendering, we must have one of the environment variables set
  // If we're in production (Vercel), this is likely the root cause of "localhost:3000" errors
  if (process.env.NODE_ENV === 'production') {
    // In production, instead of defaulting to localhost (which will fail),
    // log a warning and use a relative URL strategy
    console.warn('WARNING: No NEXT_PUBLIC_API_URL or NEXTAUTH_URL set in production environment.');
    // Return empty string for relative URLs - this means all calls will be relative to the current host
    return '';
  }
  
  // Only for development - fallback to localhost
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export function getApiUrl(path: string) {
  const baseUrl = getBaseUrl();
  
  // In production, if we don't have a base URL, use a relative URL
  if (process.env.NODE_ENV === 'production' && !baseUrl) {
    // Ensure path starts with /
    return path.startsWith('/') ? path : `/${path}`;
  }
  
  // Normal case - combine base URL with path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
} 