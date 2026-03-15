/**
 * Utility functions for API request handling
 */

/**
 * Standard API request handler with error handling
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Additional options
 * @returns {Promise} API response
 */
export async function handleApiRequest(apiCall, options = {}) {
  const { 
    setLoading, 
    setError, 
    onSuccess, 
    onError,
    loadingState = true 
  } = options

  if (setLoading && loadingState) {
    setLoading(true)
  }
  
  try {
    const result = await apiCall()
    if (onSuccess) {
      onSuccess(result)
    }
    return result
  } catch (error) {
    const errorMessage = error.message || 'Произошла ошибка'
    if (setError) {
      setError(errorMessage)
    }
    if (onError) {
      onError(error)
    }
    throw error
  } finally {
    if (setLoading && loadingState) {
      setLoading(false)
    }
  }
}

/**
 * Load data with standard pattern
 * @param {Function} loadData - Function to load data
 * @param {Object} state - State object with setters
 * @returns {Promise} Loaded data
 */
export async function loadWithStandardPattern(loadData, state) {
  const { setLoading, setError, setData } = state
  
  return handleApiRequest(loadData, {
    setLoading,
    setError,
    onSuccess: setData
  })
}

/**
 * Handle form submission with validation
 * @param {Function} submitFunction - Function to call for submission
 * @param {Object} form - Form data
 * @param {Object} options - Additional options
 * @returns {Promise} Submission result
 */
export async function handleFormSubmit(submitFunction, form, options = {}) {
  const { 
    setFormError, 
    resetForm, 
    onSuccess, 
    validateBeforeSubmit 
  } = options

  if (validateBeforeSubmit && !validateBeforeSubmit()) {
    return
  }

  try {
    const result = await submitFunction(form)
    if (resetForm) {
      resetForm()
    }
    if (onSuccess) {
      onSuccess(result)
    }
    return result
  } catch (error) {
    if (setFormError) {
      setFormError(error.message)
    }
    throw error
  }
}
