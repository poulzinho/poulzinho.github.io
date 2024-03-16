import '@testing-library/jest-dom'

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(),
})
