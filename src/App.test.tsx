import { render, screen } from '@testing-library/react'
import App from './App.tsx'

describe('App', () => {
  it('should render the website owner', () => {
    render(<App />)
    expect(screen.getByText(/paul gualotuna \- 2024/i)).toBeInTheDocument()
  })
})
