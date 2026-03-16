import { buildUrl, constructApiUrl, formatQueryString } from '../urlBuilder'

describe('buildUrl', () => {
  describe('построение базового URL', () => {
    test('строит URL с относительным путём', () => {
      // Arrange
      const path = '/api/users'
      const params = {}
      const baseUrl = 'http://localhost:8080'
      
      // Act
      const result = buildUrl(path, params, baseUrl)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users')
    })

    test('строит URL с абсолютным путём', () => {
      // Arrange
      const path = 'https://api.example.com/users'
      const params = {}
      const baseUrl = 'http://localhost:8080'
      
      // Act
      const result = buildUrl(path, params, baseUrl)
      
      // Assert
      expect(result).toBe('https://api.example.com/users')
    })

    test('использует базовый URL по умолчанию', () => {
      // Arrange
      const path = '/api/users'
      const params = {}
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users')
    })
  })

  describe('добавление query-параметров', () => {
    test('добавляет один параметр', () => {
      // Arrange
      const path = '/api/users'
      const params = { page: 1 }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?page=1')
    })

    test('добавляет несколько параметров', () => {
      // Arrange
      const path = '/api/users'
      const params = { page: 1, limit: 10, search: 'john' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?page=1&limit=10&search=john')
    })

    test('кодирует специальные символы', () => {
      // Arrange
      const path = '/api/users'
      const params = { search: 'john doe', city: 'New York' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?search=john%20doe&city=New%20York')
    })

    test('кодирует кириллицу', () => {
      // Arrange
      const path = '/api/users'
      const params = { name: 'Иван', city: 'Москва' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?name=%D0%98%D0%B2%D0%B0%D0%BD&city=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0')
    })
  })

  describe('фильтрация параметров', () => {
    test('игнорирует undefined значения', () => {
      // Arrange
      const path = '/api/users'
      const params = { page: 1, limit: undefined, search: 'test' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?page=1&search=test')
    })

    test('игнорирует null значения', () => {
      // Arrange
      const path = '/api/users'
      const params = { page: 1, limit: null, search: 'test' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?page=1&search=test')
    })

    test('игнорирует пустые строки', () => {
      // Arrange
      const path = '/api/users'
      const params = { page: 1, limit: '', search: 'test' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users?page=1&search=test')
    })

    test('обрабатывает пустой объект параметров', () => {
      // Arrange
      const path = '/api/users'
      const params = {}
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users')
    })

    test('обрабатывает отсутствующие параметры', () => {
      // Arrange
      const path = '/api/users'
      
      // Act
      const result = buildUrl(path)
      
      // Assert
      expect(result).toBe('http://localhost:8080/api/users')
    })
  })

  describe('сложные случаи', () => {
    test('обрабатывает массивы в параметрах', () => {
      // Arrange
      const path = '/api/users'
      const params = { ids: [1, 2, 3], tags: ['admin', 'user'] }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      // URL constructor преобразует массивы в逗号-разделенные строки
      expect(result).toContain('ids=1%2C2%2C3')
      expect(result).toContain('tags=admin%2Cuser')
    })

    test('обрабатывает объекты в параметрах', () => {
      // Arrange
      const path = '/api/users'
      const params = { filter: { status: 'active', role: 'admin' } }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toContain('filter=%5Bobject%20Object%5D')
    })

    test('сохраняет существующие параметры в абсолютном URL', () => {
      // Arrange
      const path = 'https://api.example.com/users?existing=param'
      const params = { new: 'value' }
      
      // Act
      const result = buildUrl(path, params)
      
      // Assert
      expect(result).toContain('existing=param')
      expect(result).toContain('new=value')
    })
  })
})

describe('constructApiUrl', () => {
  test('является алиасом для buildUrl', () => {
    // Arrange
    const endpoint = '/api/users'
    const queryParams = { page: 1 }
    const baseUrl = 'http://localhost:8080'
    
    // Act
    const result1 = constructApiUrl(endpoint, queryParams, baseUrl)
    const result2 = buildUrl(endpoint, queryParams, baseUrl)
    
    // Assert
    expect(result1).toBe(result2)
  })

  test('использует базовый URL по умолчанию', () => {
    // Arrange
    const endpoint = '/api/users'
    const queryParams = { page: 1 }
    
    // Act
    const result = constructApiUrl(endpoint, queryParams)
    
    // Assert
    expect(result).toBe('http://localhost:8080/api/users?page=1')
  })
})

describe('formatQueryString', () => {
  test('преобразует объект в query-строку', () => {
    // Arrange
    const params = { page: 1, limit: 10, search: 'test' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('page=1&limit=10&search=test')
  })

  test('фильтрует undefined значения', () => {
    // Arrange
    const params = { page: 1, limit: undefined, search: 'test' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('page=1&search=test')
  })

  test('фильтрует null значения', () => {
    // Arrange
    const params = { page: 1, limit: null, search: 'test' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('page=1&search=test')
  })

  test('фильтрует пустые строки', () => {
    // Arrange
    const params = { page: 1, limit: '', search: 'test' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('page=1&search=test')
  })

  test('корректно кодирует специальные символы', () => {
    // Arrange
    const params = { name: 'john doe', city: 'New York', email: 'test@example.com' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('name=john%20doe&city=New%20York&email=test%40example.com')
  })

  test('кодирует кириллицу', () => {
    // Arrange
    const params = { name: 'Иван', city: 'Москва' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('name=%D0%98%D0%B2%D0%B0%D0%BD&city=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0')
  })

  test('обрабатывает пустой объект', () => {
    // Arrange
    const params = {}
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('')
  })

  test('обрабатывает массивы', () => {
    // Arrange
    const params = { ids: [1, 2, 3], tags: ['admin', 'user'] }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('ids=1%2C2%2C3&tags=admin%2Cuser')
  })

  test('сохраняет порядок параметров', () => {
    // Arrange
    const params = { z: 1, a: 2, m: 3 }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('z=1&a=2&m=3')
  })

  test('обрабатывает специальные символы в ключах', () => {
    // Arrange
    const params = { 'user[name]': 'John', 'filter[status]': 'active' }
    
    // Act
    const result = formatQueryString(params)
    
    // Assert
    expect(result).toBe('user%5Bname%5D=John&filter%5Bstatus%5D=active')
  })
})
