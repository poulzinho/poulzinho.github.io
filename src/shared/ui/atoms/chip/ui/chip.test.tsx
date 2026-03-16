import { render, screen } from '@testing-library/react'
import ThemeProvider from 'shared/ui/theme/theme-provider'
import Chip from './chip'

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Chip', () => {
  it('renders label', () => {
    renderWithTheme(<Chip label='TypeScript' />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    renderWithTheme(<Chip label='JS' icon={<span data-testid='icon' />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('applies accentColor as border style', () => {
    renderWithTheme(<Chip label='Java' accentColor='#f89820' />)
    const chip = screen.getByText('Java').closest('span')!
    expect(chip.style.borderLeft).toContain('#f89820')
  })

  it('applies sm size classes', () => {
    renderWithTheme(<Chip label='Tag' size='sm' />)
    expect(screen.getByText('Tag').closest('span')!.className).toContain('text-xs')
  })

  it('forwards extra className', () => {
    renderWithTheme(<Chip label='X' className='custom' />)
    expect(screen.getByText('X').closest('span')!.className).toContain('custom')
  })
})
