// Настройка тестовой среды для Jest

// Импорт моков для DOM
import '@testing-library/jest-dom'

// Мок для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Мок для sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Мок для window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    replace: jest.fn(),
    assign: jest.fn(),
    reload: jest.fn(),
  },
  writable: true,
})

// Мок для window.history
Object.defineProperty(window, 'history', {
  value: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
  },
  writable: true,
})

// Мок для window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true,
})

// Мок для window.close
Object.defineProperty(window, 'close', {
  value: jest.fn(),
  writable: true,
})

// Мок для window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

// Мок для window.alert
Object.defineProperty(window, 'alert', {
  value: jest.fn(),
  writable: true,
})

// Мок для window.confirm
Object.defineProperty(window, 'confirm', {
  value: jest.fn(() => true),
  writable: true,
})

// Мок для window.prompt
Object.defineProperty(window, 'prompt', {
  value: jest.fn(() => ''),
  writable: true,
})

// Мок для ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Мок для IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Мок для MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}))

// Мок для requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0))
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id))

// Мок для performance.now
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
  writable: true,
})

// Мок для crypto.getRandomValues
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: jest.fn(() => new Uint32Array(1)),
  },
  writable: true,
})

// Мок для console (чтобы избежать вывода в тестах)
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

// Моки для DOM операций в csvExport
const mockCreateElement = jest.fn(() => ({
  href: '',
  download: '',
  style: {},
  click: jest.fn(),
}))

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true,
})

Object.defineProperty(global.URL, 'createObjectURL', {
  value: jest.fn(() => 'blob:test-url'),
  writable: true,
})

Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true,
})

global.Blob = jest.fn((content, options) => ({
  content,
  type: options?.type || 'text/plain',
}))

// Очистка моков после каждого теста
afterEach(() => {
  jest.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
  sessionStorageMock.getItem.mockClear()
  sessionStorageMock.setItem.mockClear()
  sessionStorageMock.removeItem.mockClear()
  sessionStorageMock.clear.mockClear()
})
