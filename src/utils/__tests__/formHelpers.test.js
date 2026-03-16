import { 
  updateFormField, 
  updateNestedField, 
  updateDeepNestedField,
  addFormItem,
  removeFormItem,
  resetForm,
  handleFilterChange,
  applyFilters,
  clearFilters
} from '../formHelpers'

describe('updateFormField', () => {
  describe('плоские поля', () => {
    test('обновляет простое поле формы', () => {
      // Arrange
      const setForm = jest.fn()
      const event = {
        target: { name: 'name', value: 'John' }
      }
      
      // Act
      updateFormField(setForm, event)
      
      // Assert
      expect(setForm).toHaveBeenCalledWith(expect.any(Function))
      const updater = setForm.mock.calls[0][0]
      const result = updater({ name: 'Jane', email: 'jane@example.com' })
      expect(result).toEqual({ name: 'John', email: 'jane@example.com' })
    })

    test('сохраняет остальные поля без изменений', () => {
      // Arrange
      const setForm = jest.fn()
      const event = {
        target: { name: 'email', value: 'new@email.com' }
      }
      const prevForm = { name: 'John', email: 'old@email.com', age: 30 }
      
      // Act
      updateFormField(setForm, event)
      const updater = setForm.mock.calls[0][0]
      const result = updater(prevForm)
      
      // Assert
      expect(result).toEqual({
        name: 'John',
        email: 'new@email.com',
        age: 30
      })
    })

    test('обрабатывает числовые значения', () => {
      // Arrange
      const setForm = jest.fn()
      const event = {
        target: { name: 'age', value: '25' }
      }
      
      // Act
      updateFormField(setForm, event)
      const updater = setForm.mock.calls[0][0]
      const result = updater({ name: 'John', age: 30 })
      
      // Assert
      expect(result.age).toBe('25')
    })
  })
})

describe('updateNestedField', () => {
  test('обновляет поле в массиве', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ]
    }
    
    // Act
    updateNestedField(setForm, 0, 'name', 'Updated Item 1', 'items')
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.items[0].name).toBe('Updated Item 1')
    expect(result.items[1].name).toBe('Item 2')
    expect(result.items).toHaveLength(2)
  })

  test('создает новый массив (не мутирует оригинал)', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      items: [{ id: 1, name: 'Item 1' }]
    }
    
    // Act
    updateNestedField(setForm, 0, 'name', 'Updated', 'items')
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.items).not.toBe(prevForm.items)
    expect(result.items[0]).not.toBe(prevForm.items[0])
  })

  test('использует arrayKey по умолчанию', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      items: [{ id: 1, name: 'Item 1' }]
    }
    
    // Act
    updateNestedField(setForm, 0, 'name', 'Updated')
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.items[0].name).toBe('Updated')
  })
})

describe('updateDeepNestedField', () => {
  test('обновляет глубоко вложенное поле', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      generationDates: [
        {
          deliveries: [
            {
              route: [
                { latitude: 55.75, longitude: 37.61 },
                { latitude: 55.76, longitude: 37.62 }
              ]
            }
          ]
        }
      ]
    }
    
    // Act
    updateDeepNestedField(setForm, 0, 0, 1, 'latitude', 55.77)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.generationDates[0].deliveries[0].route[1].latitude).toBe(55.77)
    expect(result.generationDates[0].deliveries[0].route[0].latitude).toBe(55.75)
  })

  test('создает новые объекты на всех уровнях вложенности', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      generationDates: [
        {
          deliveries: [
            {
              route: [{ latitude: 55.75, longitude: 37.61 }]
            }
          ]
        }
      ]
    }
    
    // Act
    updateDeepNestedField(setForm, 0, 0, 0, 'longitude', 37.63)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.generationDates).not.toBe(prevForm.generationDates)
    expect(result.generationDates[0]).not.toBe(prevForm.generationDates[0])
    expect(result.generationDates[0].deliveries).not.toBe(prevForm.generationDates[0].deliveries)
    expect(result.generationDates[0].deliveries[0]).not.toBe(prevForm.generationDates[0].deliveries[0])
    expect(result.generationDates[0].deliveries[0].route).not.toBe(prevForm.generationDates[0].deliveries[0].route)
  })
})

describe('addFormItem', () => {
  test('добавляет новый элемент в массив', () => {
    // Arrange
    const setForm = jest.fn()
    const createItem = jest.fn((index) => ({ id: index, name: `Item ${index}` }))
    const prevForm = {
      items: [{ id: 1, name: 'Item 1' }]
    }
    
    // Act
    addFormItem(setForm, 'items', createItem)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(createItem).toHaveBeenCalledWith(2)
    expect(result.items).toHaveLength(2)
    expect(result.items[1]).toEqual({ id: 2, name: 'Item 2' })
  })

  test('сохраняет существующие элементы', () => {
    // Arrange
    const setForm = jest.fn()
    const createItem = jest.fn(() => ({ id: 3, name: 'Item 3' }))
    const prevForm = {
      items: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }]
    }
    
    // Act
    addFormItem(setForm, 'items', createItem)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.items[0]).toEqual({ id: 1, name: 'Item 1' })
    expect(result.items[1]).toEqual({ id: 2, name: 'Item 2' })
    expect(result.items[2]).toEqual({ id: 3, name: 'Item 3' })
  })
})

describe('removeFormItem', () => {
  test('удаляет элемент из массива', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      items: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
    
    // Act
    removeFormItem(setForm, 'items', 1, 1)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toBe(1)
    expect(result.items[1].id).toBe(3)
  })

  test('не удаляет если достигнут минимум', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      items: [{ id: 1 }]
    }
    
    // Act
    removeFormItem(setForm, 'items', 0, 1)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result).toBe(prevForm)
    expect(result.items).toHaveLength(1)
  })

  test('удаляет если элементов больше минимума', () => {
    // Arrange
    const setForm = jest.fn()
    const prevForm = {
      items: [{ id: 1 }, { id: 2 }]
    }
    
    // Act
    removeFormItem(setForm, 'items', 0, 1)
    const updater = setForm.mock.calls[0][0]
    const result = updater(prevForm)
    
    // Assert
    expect(result.items).toHaveLength(1)
    expect(result.items[0].id).toBe(2)
  })
})

describe('resetForm', () => {
  test('сбрасывает форму к начальным значениям', () => {
    // Arrange
    const setForm = jest.fn()
    const setEditing = jest.fn()
    const initialForm = { name: '', email: '', age: '' }
    const currentForm = { name: 'John', email: 'john@example.com', age: 30 }
    
    // Act
    resetForm(setForm, setEditing, initialForm)
    
    // Assert
    expect(setForm).toHaveBeenCalledWith(initialForm)
    expect(setEditing).toHaveBeenCalledWith(null)
  })

  test('работает без setEditing', () => {
    // Arrange
    const setForm = jest.fn()
    const initialForm = { name: '', email: '' }
    
    // Act & Assert
    expect(() => {
      resetForm(setForm, null, initialForm)
    }).not.toThrow()
    
    expect(setForm).toHaveBeenCalledWith(initialForm)
  })
})

describe('handleFilterChange', () => {
  test('обновляет форму фильтров', () => {
    // Arrange
    const setFilterForm = jest.fn()
    const event = {
      target: { name: 'search', value: 'test' }
    }
    
    // Act
    handleFilterChange(setFilterForm, null, event)
    const updater = setFilterForm.mock.calls[0][0]
    const result = updater({ search: '', status: 'active' })
    
    // Assert
    expect(result).toEqual({ search: 'test', status: 'active' })
  })

  test('работает без setFilters', () => {
    // Arrange
    const setFilterForm = jest.fn()
    const event = {
      target: { name: 'status', value: 'inactive' }
    }
    
    // Act & Assert
    expect(() => {
      handleFilterChange(setFilterForm, null, event)
    }).not.toThrow()
  })
})

describe('applyFilters', () => {
  test('применяет фильтры из формы', () => {
    // Arrange
    const event = { preventDefault: jest.fn() }
    const filterForm = { search: 'test', status: 'active' }
    const setFilters = jest.fn()
    
    // Act
    applyFilters(event, filterForm, setFilters)
    
    // Assert
    expect(event.preventDefault).toHaveBeenCalled()
    expect(setFilters).toHaveBeenCalledWith(filterForm)
  })
})

describe('clearFilters', () => {
  test('очищает фильтры до значений по умолчанию', () => {
    // Arrange
    const setFilterForm = jest.fn()
    const setFilters = jest.fn()
    const defaultFilters = { search: '', status: '', date: '' }
    
    // Act
    clearFilters(setFilterForm, setFilters, defaultFilters)
    
    // Assert
    expect(setFilterForm).toHaveBeenCalledWith(defaultFilters)
    expect(setFilters).toHaveBeenCalledWith(defaultFilters)
  })

  test('использует пустой объект по умолчанию', () => {
    // Arrange
    const setFilterForm = jest.fn()
    const setFilters = jest.fn()
    
    // Act
    clearFilters(setFilterForm, setFilters)
    
    // Assert
    expect(setFilterForm).toHaveBeenCalledWith({})
    expect(setFilters).toHaveBeenCalledWith({})
  })
})
