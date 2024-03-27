import Layout from './layout.view.tsx'
import { render, screen } from '@testing-library/react'

describe('Layout', () => {
  it('should render the Layout with its elements', () => {
    render(<Layout />)

    // Check if the toolbar is rendered
    const toolbar = screen.getByLabelText('Toolbar')
    expect(toolbar).toBeInTheDocument()
  })
})
