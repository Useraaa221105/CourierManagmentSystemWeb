/**
 * Utility functions for URL building and manipulation
 */

/**
 * Build URL with query parameters
 * @param {string} path - Base path or full URL
 * @param {Object} params - Query parameters object
 * @param {string} baseUrl - Base URL for relative paths
 * @returns {string} Complete URL with query parameters
 */
export function buildUrl(path, params = {}, baseUrl = 'http://localhost:8080') {
  const base = path.startsWith('http') ? path : `${baseUrl}${path}`
  const url = new URL(base)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.append(key, value)
    })
  }
  
  return url.toString()
}

/**
 * Construct API URL with query parameters (legacy function for compatibility)
 * @param {string} endpoint - API endpoint
 * @param {Object} queryParams - Query parameters
 * @param {string} baseUrl - Base URL
 * @returns {string} Complete API URL
 */
export function constructApiUrl(endpoint, queryParams = {}, baseUrl = 'http://localhost:8080') {
  return buildUrl(endpoint, queryParams, baseUrl)
}

/**
 * Format query string from parameters object
 * @param {Object} params - Parameters object
 * @returns {string} Formatted query string
 */
export function formatQueryString(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}
