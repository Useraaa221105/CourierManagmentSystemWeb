# 📋 Руководство по тестированию

## 🧪 Автоматические тесты для утилит рефакторинга

В проекте созданы полные автоматические тесты для 4 утилит в папке `src/utils/`:

### 📁 Структура тестов

```
src/utils/
├── __tests__/
│   ├── csvExport.test.js      # Тесты экспорта в CSV
│   ├── urlBuilder.test.js     # Тесты построения URL
│   ├── apiHelpers.test.js     # Тесты API-помощников
│   └── formHelpers.test.js    # Тесты помощников форм
├── csvExport.js               # Утилита экспорта CSV
├── urlBuilder.js              # Утилита построения URL
├── apiHelpers.js              # Утилита API-помощников
└── formHelpers.js             # Утилита помощников форм
```

## 🚀 Запуск тестов

### Установка зависимостей

```bash
npm install
```

### Запуск всех тестов

```bash
npm test
```

### Запуск тестов в watch-режиме

```bash
npm run test:watch
```

### Запуск тестов с покрытием кода

```bash
npm run test:coverage
```

### Запуск для CI/CD

```bash
npm run test:ci
```

### Запуск конкретного файла тестов

```bash
npm test csvExport.test.js
npm test urlBuilder.test.js
npm test apiHelpers.test.js
npm test formHelpers.test.js
```

## 📊 Покрытие кода

Тесты обеспечивают минимальное покрытие 80% для каждой утилиты:

- ✅ **csvExport.js** - 80%+ покрытие
- ✅ **urlBuilder.js** - 80%+ покрытие  
- ✅ **apiHelpers.js** - 80%+ покрытие
- ✅ **formHelpers.js** - 80%+ покрытие

### Пороги покрытия

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  },
  './src/utils/csvExport.js': {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  // ... другие утилиты
}
```

## 🧪 Сценарии тестирования

### 1. csvExport.test.js

**Тестируемые функции:**
- `exportToCsv()` - универсальный экспорт
- `exportUsersToCsv()` - экспорт пользователей
- `exportVehiclesToCsv()` - экспорт машин

**Сценарии:**
- ✅ Создание CSV с заголовками и данными
- ✅ Экранирование запятых и кавычек
- ✅ Обработка кириллицы
- ✅ DOM операции (создание ссылки, скачивание)
- ✅ Обработка пустых данных
- ✅ Очистка URL после скачивания

### 2. urlBuilder.test.js

**Тестируемые функции:**
- `buildUrl()` - построение URL
- `constructApiUrl()` - алиас buildUrl
- `formatQueryString()` - форматирование query строки

**Сценарии:**
- ✅ Построение относительных и абсолютных URL
- ✅ Добавление query-параметров
- ✅ Кодирование спецсимволов и кириллицы
- ✅ Фильтрация undefined/null/пустых значений
- ✅ Обработка массивов в параметрах

### 3. apiHelpers.test.js

**Тестируемые функции:**
- `handleApiRequest()` - обработка API запросов
- `loadWithStandardPattern()` - загрузка данных
- `handleFormSubmit()` - отправка форм

**Сценарии:**
- ✅ Управление состоянием loading/error
- ✅ Обработка успешных ответов
- ✅ Обработка ошибок
- ✅ Валидация форм
- ✅ Асинхронное поведение

### 4. formHelpers.test.js

**Тестируемые функции:**
- `updateFormField()` - обновление полей
- `updateNestedField()` - обновление вложенных полей
- `updateDeepNestedField()` - глубокое обновление
- `addFormItem()`/`removeFormItem()` - управление массивами
- `resetForm()` - сброс форм
- `applyFilters()`/`clearFilters()` - фильтры

**Сценарии:**
- ✅ Обновление плоских и вложенных полей
- ✅ Имутабельность (не мутирует оригинал)
- ✅ Управление массивами в формах
- ✅ Сброс и очистка форм
- ✅ Обработка фильтров

## 🔧 Конфигурация

### Jest конфигурация (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx}'
  ],
  coverageThreshold: {
    // ... пороги покрытия
  }
}
```

### Настройка тестовой среды (`src/setupTests.js`)

- Моки для localStorage/sessionStorage
- Моки для DOM API (document, window)
- Моки для браузерных API (ResizeObserver, IntersectionObserver)
- Очистка моков после каждого теста

## 📈 Отчеты о покрытии

После запуска `npm run test:coverage`:

1. **Консольный вывод** - краткая статистика
2. **HTML отчет** - детальный отчет в `coverage/lcov-report/index.html`
3. **LCOV файл** - для CI/CD систем в `coverage/lcov.info`

### Просмотр HTML отчета

```bash
# Открыть в браузере
open coverage/lcov-report/index.html
```

## 🐛 Отладка тестов

### Запуск с отладчиком

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Отладка конкретного теста

```bash
npm test -- --testNamePattern="название_теста"
```

### Подробный вывод

```bash
npm test -- --verbose
```

## 🔄 CI/CD интеграция

### GitHub Actions

```yaml
- name: Run tests
  run: npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Требования к CI

- ✅ Все тесты проходят
- ✅ Покрытие ≥ 80% для каждой утилиты
- ✅ Нет предупреждений в консоли
- ✅ Тесты изолированы

## 📝 Написание новых тестов

### Структура теста

```javascript
describe('functionName', () => {
  describe('scenario', () => {
    test('should do something when condition', () => {
      // Arrange
      const input = {}
      const expected = {}
      
      // Act
      const result = functionName(input)
      
      // Assert
      expect(result).toEqual(expected)
    })
  })
})
```

### Лучшие практики

1. **Arrange-Act-Assert** паттерн
2. **Изолированные тесты** - не зависят друг от друга
3. **Описательные названия** - что тестируется + ожидаемый результат
4. **Моки** - для внешних зависимостей
5. **Очистка** - afterEach для сброса состояния

## 🚨 Частые проблемы

### Проблема: Тесты не находят модули

**Решение:** Проверьте импорты и пути в `jest.config.js`

### Проблема: Покрытие низкое

**Решение:** Добавьте тесты для непокрытых веток кода

### Проблема: Моки не работают

**Решение:** Очищайте моки в `afterEach()` или используйте `jest.clearAllMocks()`

### Проблема: Асинхронные тесты

**Решение:** Используйте `async/await` или `return Promise`

## 📞 Поддержка

Если возникли проблемы с тестами:

1. Проверьте версию Node.js (рекомендуется 16+)
2. Обновите зависимости: `npm install`
3. Очистите кэш Jest: `npm test -- --clearCache`
4. Проверьте конфигурацию в `jest.config.js`

---

**Автор:** AI Assistant  
**Дата:** 2024  
**Версия:** 1.0
