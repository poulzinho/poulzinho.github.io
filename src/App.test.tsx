import { render } from '@testing-library/react'
import App from './App.tsx'

describe('App', () => {
  it('should render the website without crashes', () => {
    render(<App />)
  })
})
