/**
 * Utility functions for form handling and state management
 */

/**
 * Update form field with standard pattern
 * @param {Function} setForm - Form state setter
 * @param {Object} event - Form event object
 */
export function updateFormField(setForm, event) {
  const { name, value } = event.target
  setForm((prev) => ({ ...prev, [name]: value }))
}

/**
 * Update nested form field
 * @param {Function} setForm - Form state setter
 * @param {number} index - Index in array
 * @param {string} field - Field name
 * @param {any} value - New value
 * @param {string} arrayKey - Key of array in form
 */
export function updateNestedField(setForm, index, field, value, arrayKey = 'items') {
  setForm((prev) => {
    const array = [...prev[arrayKey]]
    array[index] = { ...array[index], [field]: value }
    return { ...prev, [arrayKey]: array }
  })
}

/**
 * Update deeply nested field (for complex forms like deliveries)
 * @param {Function} setForm - Form state setter
 * @param {number} dateIndex - Date index
 * @param {number} deliveryIndex - Delivery index  
 * @param {number} pointIndex - Point index
 * @param {string} field - Field name
 * @param {any} value - New value
 */
export function updateDeepNestedField(setForm, dateIndex, deliveryIndex, pointIndex, field, value) {
  setForm((prev) => {
    const dates = [...prev.generationDates]
    const route = [...dates[dateIndex].deliveries[deliveryIndex].route]
    route[pointIndex] = { ...route[pointIndex], [field]: value }
    dates[dateIndex].deliveries[deliveryIndex] = {
      ...dates[dateIndex].deliveries[deliveryIndex],
      route
    }
    return { ...prev, generationDates: dates }
  })
}

/**
 * Add item to array in form
 * @param {Function} setForm - Form state setter
 * @param {string} arrayKey - Key of array
 * @param {Function} createItem - Function to create new item
 */
export function addFormItem(setForm, arrayKey, createItem) {
  setForm((prev) => ({
    ...prev,
    [arrayKey]: [...prev[arrayKey], createItem(prev[arrayKey].length + 1)]
  }))
}

/**
 * Remove item from array in form
 * @param {Function} setForm - Form state setter
 * @param {string} arrayKey - Key of array
 * @param {number} index - Index to remove
 * @param {number} minItems - Minimum items to keep
 */
export function removeFormItem(setForm, arrayKey, index, minItems = 1) {
  setForm((prev) => {
    if (prev[arrayKey].length <= minItems) return prev
    const newArray = prev[arrayKey].filter((_, idx) => idx !== index)
    return { ...prev, [arrayKey]: newArray }
  })
}

/**
 * Reset form to initial state
 * @param {Function} setForm - Form state setter
 * @param {Function} setEditing - Editing state setter
 * @param {Object} initialForm - Initial form data
 */
export function resetForm(setForm, setEditing, initialForm) {
  setForm(initialForm)
  if (setEditing) {
    setEditing(null)
  }
}

/**
 * Handle filter form changes
 * @param {Function} setFilterForm - Filter form setter
 * @param {Function} setFilters - Applied filters setter
 * @param {Object} event - Form event
 */
export function handleFilterChange(setFilterForm, setFilters, event) {
  const { name, value } = event.target
  setFilterForm((prev) => ({ ...prev, [name]: value }))
}

/**
 * Apply filters with form validation
 * @param {Object} event - Form submit event
 * @param {Object} filterForm - Filter form data
 * @param {Function} setFilters - Applied filters setter
 */
export function applyFilters(event, filterForm, setFilters) {
  event.preventDefault()
  setFilters(filterForm)
}

/**
 * Clear filters to default state
 * @param {Function} setFilterForm - Filter form setter
 * @param {Function} setFilters - Applied filters setter
 * @param {Object} defaultFilters - Default filter values
 */
export function clearFilters(setFilterForm, setFilters, defaultFilters = {}) {
  setFilterForm(defaultFilters)
  setFilters(defaultFilters)
}
