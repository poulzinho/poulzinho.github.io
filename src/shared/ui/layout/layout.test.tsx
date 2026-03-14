import Layout from './layout'
import { render, screen } from '@testing-library/react'

describe('Layout', () => {
  it('should render the Layout with its elements', () => {
    render(<Layout />)

    const toolbar = screen.getByLabelText('Toolbar')
    expect(toolbar).toBeInTheDocument()
  })
})
