import { render, screen } from '@testing-library/react'
import Divider from './divider'

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders a vertical separator', () => {
    render(<Divider orientation='vertical' />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('forwards extra className', () => {
    render(<Divider className='my-class' />)
    expect(screen.getByRole('separator').className).toContain('my-class')
  })
})
