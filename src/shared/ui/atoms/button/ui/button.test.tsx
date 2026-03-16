import { render, screen, fireEvent } from '@testing-library/react'
import ThemeProvider from 'shared/ui/theme/theme-provider'
import Button from './button'

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Button', () => {
  it('renders children', () => {
    renderWithTheme(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders as <a> when href is provided', () => {
    renderWithTheme(<Button href='https://example.com'>Link</Button>)
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    renderWithTheme(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders leftIcon and rightIcon', () => {
    renderWithTheme(
      <Button leftIcon={<span data-testid='left' />} rightIcon={<span data-testid='right' />}>
        Label
      </Button>
    )
    expect(screen.getByTestId('left')).toBeInTheDocument()
    expect(screen.getByTestId('right')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    renderWithTheme(<Button size='lg'>Big</Button>)
    expect(screen.getByRole('button').className).toContain('text-base')
  })

  it('forwards aria-label', () => {
    renderWithTheme(<Button aria-label='custom label'>X</Button>)
    expect(screen.getByRole('button', { name: 'custom label' })).toBeInTheDocument()
  })

  it('forwards extra className', () => {
    renderWithTheme(<Button className='my-class'>X</Button>)
    expect(screen.getByRole('button').className).toContain('my-class')
  })
})
