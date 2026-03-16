import { handleApiRequest, loadWithStandardPattern, handleFormSubmit } from '../apiHelpers'

describe('handleApiRequest', () => {
  let mockSetLoading, mockSetError, mockOnSuccess, mockOnError, mockApiCall

  beforeEach(() => {
    jest.clearAllMocks()
    mockSetLoading = jest.fn()
    mockSetError = jest.fn()
    mockOnSuccess = jest.fn()
    mockOnError = jest.fn()
    mockApiCall = jest.fn()
  })

  describe('happy path', () => {
    test('вызывает setLoading перед запросом', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      mockApiCall.mockResolvedValue(mockData)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(mockSetLoading).toHaveBeenCalledWith(true)
    })

    test('вызывает onSuccess при успешном ответе', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      mockApiCall.mockResolvedValue(mockData)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError,
        onSuccess: mockOnSuccess
      })

      // Assert
      expect(mockOnSuccess).toHaveBeenCalledWith(mockData)
    })

    test('возвращает данные при успешном ответе', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      mockApiCall.mockResolvedValue(mockData)

      // Act
      const result = await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(result).toEqual(mockData)
    })

    test('вызывает setLoading(false) после завершения', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      mockApiCall.mockResolvedValue(mockData)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(mockSetLoading).toHaveBeenCalledWith(true)
      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })

    test('работает без опций', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      mockApiCall.mockResolvedValue(mockData)

      // Act
      const result = await handleApiRequest(mockApiCall)

      // Assert
      expect(result).toEqual(mockData)
    })

    test('не вызывает setLoading если loadingState = false', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      mockApiCall.mockResolvedValue(mockData)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        loadingState: false
      })

      // Assert
      expect(mockSetLoading).not.toHaveBeenCalled()
    })
  })

  describe('error cases', () => {
    test('вызывает setError при ошибке', async () => {
      // Arrange
      const mockError = new Error('API Error')
      mockApiCall.mockRejectedValue(mockError)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(mockSetError).toHaveBeenCalledWith('API Error')
    })

    test('вызывает onError при ошибке', async () => {
      // Arrange
      const mockError = new Error('API Error')
      mockApiCall.mockRejectedValue(mockError)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError,
        onError: mockOnError
      })

      // Assert
      expect(mockOnError).toHaveBeenCalledWith(mockError)
    })

    test('пробрасывает ошибку', async () => {
      // Arrange
      const mockError = new Error('API Error')
      mockApiCall.mockRejectedValue(mockError)

      // Act & Assert
      await expect(handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })).rejects.toThrow('API Error')
    })

    test('использует сообщение по умолчанию если нет message в ошибке', async () => {
      // Arrange
      const mockError = new Error()
      delete mockError.message
      mockApiCall.mockRejectedValue(mockError)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(mockSetError).toHaveBeenCalledWith('Произошла ошибка')
    })

    test('вызывает setLoading(false) после ошибки', async () => {
      // Arrange
      const mockError = new Error('API Error')
      mockApiCall.mockRejectedValue(mockError)

      // Act
      await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(mockSetLoading).toHaveBeenCalledWith(true)
      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })
  })

  describe('async behavior', () => {
    test('корректно работает с асинхронными функциями', async () => {
      // Arrange
      const mockData = { id: 1 }
      mockApiCall.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockData), 100))
      )

      // Act
      const result = await handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })

      // Assert
      expect(result).toEqual(mockData)
      expect(mockSetLoading).toHaveBeenCalledWith(true)
      expect(mockSetLoading).toHaveBeenCalledWith(false)
    })

    test('обрабатывает таймауты', async () => {
      // Arrange
      mockApiCall.mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      )

      // Act & Assert
      await expect(handleApiRequest(mockApiCall, {
        setLoading: mockSetLoading,
        setError: mockSetError
      })).rejects.toThrow('Timeout')
    })
  })
})

describe('loadWithStandardPattern', () => {
  let mockState, mockLoadData

  beforeEach(() => {
    jest.clearAllMocks()
    mockState = {
      setLoading: jest.fn(),
      setError: jest.fn(),
      setData: jest.fn()
    }
    mockLoadData = jest.fn()
  })

  test('устанавливает loading = true перед запросом', async () => {
    // Arrange
    const mockData = [{ id: 1, name: 'Test' }]
    mockLoadData.mockResolvedValue(mockData)

    // Act
    await loadWithStandardPattern(mockLoadData, mockState)

    // Assert
    expect(mockState.setLoading).toHaveBeenCalledWith(true)
  })

  test('вызывает loadData', async () => {
    // Arrange
    const mockData = [{ id: 1, name: 'Test' }]
    mockLoadData.mockResolvedValue(mockData)

    // Act
    await loadWithStandardPattern(mockLoadData, mockState)

    // Assert
    expect(mockLoadData).toHaveBeenCalled()
  })

  test('вызывает setData с полученными данными', async () => {
    // Arrange
    const mockData = [{ id: 1, name: 'Test' }]
    mockLoadData.mockResolvedValue(mockData)

    // Act
    await loadWithStandardPattern(mockLoadData, mockState)

    // Assert
    expect(mockState.setData).toHaveBeenCalledWith(mockData)
  })

  test('устанавливает loading = false после завершения', async () => {
    // Arrange
    const mockData = [{ id: 1, name: 'Test' }]
    mockLoadData.mockResolvedValue(mockData)

    // Act
    await loadWithStandardPattern(mockLoadData, mockState)

    // Assert
    expect(mockState.setLoading).toHaveBeenCalledWith(true)
    expect(mockState.setLoading).toHaveBeenCalledWith(false)
  })

  test('устанавливает error при ошибке загрузки', async () => {
    // Arrange
    const mockError = new Error('Load Error')
    mockLoadData.mockRejectedValue(mockError)

    // Act
    await loadWithStandardPattern(mockLoadData, mockState)

    // Assert
    expect(mockState.setError).toHaveBeenCalledWith('Load Error')
  })

  test('не вызывает setData при ошибке', async () => {
    // Arrange
    const mockError = new Error('Load Error')
    mockLoadData.mockRejectedValue(mockError)

    // Act
    await loadWithStandardPattern(mockLoadData, mockState)

    // Assert
    expect(mockState.setData).not.toHaveBeenCalled()
  })

  test('пробрасывает ошибку', async () => {
    // Arrange
    const mockError = new Error('Load Error')
    mockLoadData.mockRejectedValue(mockError)

    // Act & Assert
    await expect(loadWithStandardPattern(mockLoadData, mockState)).rejects.toThrow('Load Error')
  })
})

describe('handleFormSubmit', () => {
  let mockSubmitFunction, mockForm, mockOptions

  beforeEach(() => {
    jest.clearAllMocks()
    mockSubmitFunction = jest.fn()
    mockForm = { name: 'John', email: 'john@example.com' }
    mockOptions = {}
  })

  describe('happy path', () => {
    test('вызывает submitFunction с формой', async () => {
      // Arrange
      const mockResult = { id: 1, ...mockForm }
      mockSubmitFunction.mockResolvedValue(mockResult)

      // Act
      const result = await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockSubmitFunction).toHaveBeenCalledWith(mockForm)
      expect(result).toEqual(mockResult)
    })

    test('вызывает resetForm после успешной отправки', async () => {
      // Arrange
      const mockResult = { id: 1 }
      const mockResetForm = jest.fn()
      mockSubmitFunction.mockResolvedValue(mockResult)
      mockOptions.resetForm = mockResetForm

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockResetForm).toHaveBeenCalled()
    })

    test('вызывает onSuccess после успешной отправки', async () => {
      // Arrange
      const mockResult = { id: 1 }
      const mockOnSuccess = jest.fn()
      mockSubmitFunction.mockResolvedValue(mockResult)
      mockOptions.onSuccess = mockOnSuccess

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResult)
    })

    test('работает без опций', async () => {
      // Arrange
      const mockResult = { id: 1 }
      mockSubmitFunction.mockResolvedValue(mockResult)

      // Act
      const result = await handleFormSubmit(mockSubmitFunction, mockForm)

      // Assert
      expect(result).toEqual(mockResult)
    })
  })

  describe('validation', () => {
    test('вызывает validateBeforeSubmit', async () => {
      // Arrange
      const mockValidate = jest.fn(() => true)
      mockOptions.validateBeforeSubmit = mockValidate
      mockSubmitFunction.mockResolvedValue({ id: 1 })

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockValidate).toHaveBeenCalled()
    })

    test('не отправляет форму если валидация не пройдена', async () => {
      // Arrange
      const mockValidate = jest.fn(() => false)
      mockOptions.validateBeforeSubmit = mockValidate

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockSubmitFunction).not.toHaveBeenCalled()
    })

    test('возвращает undefined если валидация не пройдена', async () => {
      // Arrange
      const mockValidate = jest.fn(() => false)
      mockOptions.validateBeforeSubmit = mockValidate

      // Act
      const result = await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('error cases', () => {
    test('вызывает setFormError при ошибке', async () => {
      // Arrange
      const mockError = new Error('Submit Error')
      const mockSetFormError = jest.fn()
      mockSubmitFunction.mockRejectedValue(mockError)
      mockOptions.setFormError = mockSetFormError

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockSetFormError).toHaveBeenCalledWith('Submit Error')
    })

    test('не вызывает resetForm при ошибке', async () => {
      // Arrange
      const mockError = new Error('Submit Error')
      const mockResetForm = jest.fn()
      mockSubmitFunction.mockRejectedValue(mockError)
      mockOptions.resetForm = mockResetForm

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockResetForm).not.toHaveBeenCalled()
    })

    test('не вызывает onSuccess при ошибке', async () => {
      // Arrange
      const mockError = new Error('Submit Error')
      const mockOnSuccess = jest.fn()
      mockSubmitFunction.mockRejectedValue(mockError)
      mockOptions.onSuccess = mockOnSuccess

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    test('пробрасывает ошибку', async () => {
      // Arrange
      const mockError = new Error('Submit Error')
      mockSubmitFunction.mockRejectedValue(mockError)

      // Act & Assert
      await expect(handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)).rejects.toThrow('Submit Error')
    })

    test('использует сообщение по умолчанию если нет message в ошибке', async () => {
      // Arrange
      const mockError = new Error()
      delete mockError.message
      const mockSetFormError = jest.fn()
      mockSubmitFunction.mockRejectedValue(mockError)
      mockOptions.setFormError = mockSetFormError

      // Act
      await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(mockSetFormError).toHaveBeenCalledWith('Произошла ошибка')
    })
  })

  describe('async behavior', () => {
    test('корректно работает с асинхронными функциями', async () => {
      // Arrange
      const mockResult = { id: 1 }
      mockSubmitFunction.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResult), 100))
      )

      // Act
      const result = await handleFormSubmit(mockSubmitFunction, mockForm, mockOptions)

      // Assert
      expect(result).toEqual(mockResult)
    })
  })
})
