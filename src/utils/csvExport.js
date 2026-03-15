/**
 * Utility functions for CSV export functionality
 */

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the CSV file
 * @param {Array} headers - Array of header strings or objects
 * @param {Function} rowMapper - Function to map data row to CSV string
 */
export function exportToCsv(data, filename, headers, rowMapper) {
  if (!data || data.length === 0) return

  const csvHeader = Array.isArray(headers[0]) 
    ? headers.map(h => Array.isArray(h) ? h.join(',') : h).join(',')
    : headers.join(',')
    
  const csvRows = data.map(rowMapper)
  const csv = [csvHeader, ...csvRows].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Export users to CSV
 * @param {Array} users - Array of user objects
 * @param {Function} formatDate - Function to format dates
 */
export function exportUsersToCsv(users, formatDate) {
  const headers = ['Имя', 'Логин', 'Роль', 'Создан']
  const rowMapper = (user) =>
    `"${user.name}","${user.login}","${user.role}","${formatDate(user.createdAt)}"`
  
  exportToCsv(users, 'users.csv', headers, rowMapper)
}

/**
 * Export vehicles to CSV
 * @param {Array} vehicles - Array of vehicle objects
 */
export function exportVehiclesToCsv(vehicles) {
  const headers = ['Марка', 'Номер', 'Макс. вес', 'Макс. объем']
  const rowMapper = (vehicle) =>
    `"${vehicle.brand}","${vehicle.licensePlate}",${vehicle.maxWeight},${vehicle.maxVolume}`
  
  exportToCsv(vehicles, 'vehicles.csv', headers, rowMapper)
}
