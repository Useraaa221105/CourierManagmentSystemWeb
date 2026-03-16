import { exportToCsv, exportUsersToCsv, exportVehiclesToCsv } from '../csvExport'

describe('exportToCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('happy path', () => {
    test('корректно создаёт CSV с заголовками и данными', () => {
      // Arrange
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' }
      ]
      const headers = ['Name', 'Age', 'City']
      const rowMapper = (row) => `${row.name},${row.age},${row.city}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Age,City\nJohn,30,New York\nJane,25,Los Angeles'
      ], { type: 'text/csv' })
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(document.createElement).toHaveBeenCalledWith('a')
    })

    test('добавляет BOM для корректного отображения кириллицы', () => {
      // Arrange
      const data = [{ name: 'Иван', city: 'Москва' }]
      const headers = ['Имя', 'Город']
      const rowMapper = (row) => `${row.name},${row.city}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Имя,Город\nИван,Москва'
      ], { type: 'text/csv' })
    })

    test('экранирует запятые в значениях', () => {
      // Arrange
      const data = [{ name: 'Doe, John', address: '123 Main St, Apt 4' }]
      const headers = ['Name', 'Address']
      const rowMapper = (row) => `"${row.name}","${row.address}"`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Address\n"Doe, John","123 Main St, Apt 4"'
      ], { type: 'text/csv' })
    })

    test('экранирует кавычки в значениях', () => {
      // Arrange
      const data = [{ name: 'John "The Man" Doe', description: 'He said "Hello"' }]
      const headers = ['Name', 'Description']
      const rowMapper = (row) => `"${row.name.replace(/"/g, '""')}","${row.description.replace(/"/g, '""')}"`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Description\n"John ""The Man"" Doe","He said ""Hello"""'
      ], { type: 'text/csv' })
    })
  })

  describe('edge cases', () => {
    test('обрабатывает пустые значения в данных', () => {
      // Arrange
      const data = [
        { name: 'John', age: 30, city: '' },
        { name: '', age: null, city: undefined }
      ]
      const headers = ['Name', 'Age', 'City']
      const rowMapper = (row) => `${row.name || ''},${row.age || ''},${row.city || ''}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Age,City\nJohn,30,\n,,'
      ], { type: 'text/csv' })
    })

    test('обрабатывает null и undefined значения', () => {
      // Arrange
      const data = [
        { name: null, age: undefined, city: 'New York' }
      ]
      const headers = ['Name', 'Age', 'City']
      const rowMapper = (row) => `${row.name || ''},${row.age || ''},${row.city || ''}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Age,City\n,,New York'
      ], { type: 'text/csv' })
    })

    test('корректно работает с пустым массивом данных', () => {
      // Arrange
      const data = []
      const headers = ['Name', 'Age', 'City']
      const rowMapper = (row) => `${row.name},${row.age},${row.city}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Age,City'
      ], { type: 'text/csv' })
    })

    test('обрабатывает массив заголовков', () => {
      // Arrange
      const data = [{ name: 'John', age: 30 }]
      const headers = ['Name', 'Age']
      const rowMapper = (row) => `${row.name},${row.age}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Age\nJohn,30'
      ], { type: 'text/csv' })
    })

    test('обрабатывает массивы в заголовках', () => {
      // Arrange
      const data = [{ name: 'John', age: 30 }]
      const headers = [['Name', 'Full Name'], ['Age', 'Years']]
      const rowMapper = (row) => `${row.name},${row.age}`

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(Blob).toHaveBeenCalledWith([
        'Name,Full Name,Age,Years\nJohn,30'
      ], { type: 'text/csv' })
    })
  })

  describe('DOM операции', () => {
    test('создаёт и кликает ссылку для скачивания', () => {
      // Arrange
      const data = [{ name: 'John' }]
      const headers = ['Name']
      const rowMapper = (row) => row.name
      const mockLink = {
        href: '',
        download: '',
        style: {},
        click: jest.fn(),
      }
      document.createElement.mockReturnValue(mockLink)

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(mockLink.href).toBe('blob:test-url')
      expect(mockLink.download).toBe('test.csv')
      expect(mockLink.click).toHaveBeenCalled()
    })

    test('очищает URL после скачивания (revokeObjectURL)', () => {
      // Arrange
      const data = [{ name: 'John' }]
      const headers = ['Name']
      const rowMapper = (row) => row.name

      // Act
      exportToCsv(data, 'test.csv', headers, rowMapper)

      // Assert
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url')
    })

    test('не делает ничего если данных нет', () => {
      // Arrange
      const data = null

      // Act
      exportToCsv(data, 'test.csv', ['Name'], (row) => row.name)

      // Assert
      expect(Blob).not.toHaveBeenCalled()
      expect(URL.createObjectURL).not.toHaveBeenCalled()
      expect(document.createElement).not.toHaveBeenCalled()
    })

    test('не делает ничего если массив данных пуст', () => {
      // Arrange
      const data = []

      // Act
      exportToCsv(data, 'test.csv', ['Name'], (row) => row.name)

      // Assert
      expect(Blob).toHaveBeenCalled()
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(document.createElement).toHaveBeenCalled()
    })
  })
})

describe('exportUsersToCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('экспортирует пользователей в правильном формате', () => {
    // Arrange
    const users = [
      { name: 'John Doe', login: 'john', role: 'admin', createdAt: '2023-01-01' },
      { name: 'Jane Smith', login: 'jane', role: 'user', createdAt: '2023-01-02' }
    ]
    const mockFormatDate = jest.fn((date) => date)

    // Act
    exportUsersToCsv(users, mockFormatDate)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Имя,Логин,Роль,Создан\n"John Doe",john,admin,2023-01-01\n"Jane Smith",jane,user,2023-01-02'
    ], { type: 'text/csv' })
    expect(mockFormatDate).toHaveBeenCalledWith('2023-01-01')
    expect(mockFormatDate).toHaveBeenCalledWith('2023-01-02')
  })

  test('использует правильное имя файла', () => {
    // Arrange
    const users = [{ name: 'John', login: 'john', role: 'admin', createdAt: '2023-01-01' }]
    const mockFormatDate = jest.fn((date) => date)
    const mockLink = { href: '', download: '', style: {}, click: jest.fn() }
    document.createElement.mockReturnValue(mockLink)

    // Act
    exportUsersToCsv(users, mockFormatDate)

    // Assert
    expect(mockLink.download).toBe('users.csv')
  })

  test('обрабатывает кириллицу в именах пользователей', () => {
    // Arrange
    const users = [
      { name: 'Иван Петров', login: 'ivan', role: 'admin', createdAt: '2023-01-01' }
    ]
    const mockFormatDate = jest.fn((date) => date)

    // Act
    exportUsersToCsv(users, mockFormatDate)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Имя,Логин,Роль,Создан\n"Иван Петров",ivan,admin,2023-01-01'
    ], { type: 'text/csv' })
  })

  test('обрабатывает пустой массив пользователей', () => {
    // Arrange
    const users = []
    const mockFormatDate = jest.fn()

    // Act
    exportUsersToCsv(users, mockFormatDate)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Имя,Логин,Роль,Создан'
    ], { type: 'text/csv' })
    expect(mockFormatDate).not.toHaveBeenCalled()
  })
})

describe('exportVehiclesToCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('экспортирует машины в правильном формате', () => {
    // Arrange
    const vehicles = [
      { brand: 'Toyota', licensePlate: 'A123BC', maxWeight: 1500, maxVolume: 10 },
      { brand: 'Ford', licensePlate: 'B456DE', maxWeight: 2000, maxVolume: 15 }
    ]

    // Act
    exportVehiclesToCsv(vehicles)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Марка,Номер,Макс. вес,Макс. объем\n"Toyota","A123BC",1500,10\n"Ford","B456DE",2000,15'
    ], { type: 'text/csv' })
  })

  test('использует правильное имя файла', () => {
    // Arrange
    const vehicles = [{ brand: 'Toyota', licensePlate: 'A123BC', maxWeight: 1500, maxVolume: 10 }]
    const mockLink = { href: '', download: '', style: {}, click: jest.fn() }
    document.createElement.mockReturnValue(mockLink)

    // Act
    exportVehiclesToCsv(vehicles)

    // Assert
    expect(mockLink.download).toBe('vehicles.csv')
  })

  test('обрабатывает числа с плавающей точкой', () => {
    // Arrange
    const vehicles = [
      { brand: 'Toyota', licensePlate: 'A123BC', maxWeight: 1500.5, maxVolume: 10.2 }
    ]

    // Act
    exportVehiclesToCsv(vehicles)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Марка,Номер,Макс. вес,Макс. объем\n"Toyota","A123BC",1500.5,10.2'
    ], { type: 'text/csv' })
  })

  test('обрабатывает пустой массив машин', () => {
    // Arrange
    const vehicles = []

    // Act
    exportVehiclesToCsv(vehicles)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Марка,Номер,Макс. вес,Макс. объем'
    ], { type: 'text/csv' })
  })

  test('экранирует кавычки в названиях брендов', () => {
    // Arrange
    const vehicles = [
      { brand: 'GM "Premium"', licensePlate: 'A123BC', maxWeight: 1500, maxVolume: 10 }
    ]

    // Act
    exportVehiclesToCsv(vehicles)

    // Assert
    expect(Blob).toHaveBeenCalledWith([
      'Марка,Номер,Макс. вес,Макс. объем\n"GM ""Premium""","A123BC",1500,10'
    ], { type: 'text/csv' })
  })
})
