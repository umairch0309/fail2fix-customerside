/**
 * App Constants
 *
 * Centralized configuration for consistent usage across the app.
 */

/**
 * Backend API URL
 * Used for all API calls to the separate backend server.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3007";

/**
 * Blog CMS API URL
 * Payload CMS for blog content management.
 */
export const BLOG_CMS_URL = process.env.NEXT_PUBLIC_BLOG_CMS_URL || "https://blog.fail2fix.co.uk";

/**
 * WebSocket URL
 * Derived from API_URL - converts http(s) to ws(s)
 */
export const WS_URL = `${API_URL.replace(/^http/, "ws")}?client=customer`;
