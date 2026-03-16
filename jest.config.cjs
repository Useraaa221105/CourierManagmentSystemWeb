module.exports = {
  // Тестовая среда
  testEnvironment: 'jsdom',
  
  // Корневая директория для тестов
  rootDir: '.',
  
  // Директории с тестами
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}'
  ],
  
  // Игнорировать файлы
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/'
  ],
  
  // Путь к модулю для настройки тестовой среды
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Модульные пути (alias)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1'
  },
  
  // Преобразование файлов
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Игнорировать преобразования для этих файлов
  transformIgnorePatterns: [
    'node_modules/(?!(axios|react-router-dom)/)'
  ],
  
  // Покрытие кода
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/main.jsx',
    '!src/setupTests.js',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}'
  ],
  
  // Пороги покрытия
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
    './src/utils/urlBuilder.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/utils/apiHelpers.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/utils/formHelpers.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Формат отчета о покрытии
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  
  // Директория для отчетов о покрытии
  coverageDirectory: 'coverage',
  
  // Глобальные переменные для тестов
  globals: {
    'process.env.NODE_ENV': 'test'
  },
  
  // Моки
  clearMocks: true,
  restoreMocks: true,
  
  // Верbose вывод
  verbose: true,
  
  // Максимальное количество работников
  maxWorkers: '50%',
  
  // Таймаут для тестов
  testTimeout: 10000
}
