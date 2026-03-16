import { render, screen } from '@testing-library/react'
import ThemeProvider from 'shared/ui/theme/theme-provider'
import Sidebar from './sidebar'

vi.mock('gsap', () => ({
  default: {
    set: vi.fn(),
    to: vi.fn(),
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({ default: {} }))
vi.mock('react-i18next')

const renderSidebar = () =>
  render(
    <ThemeProvider>
      <Sidebar />
    </ThemeProvider>
  )

describe('Sidebar', () => {
  it('renders without crashing', () => {
    renderSidebar()
  })

  it('renders site navigation landmark', () => {
    renderSidebar()
    const navs = screen.getAllByRole('complementary', { name: /site navigation/i })
    expect(navs.length).toBeGreaterThanOrEqual(1)
  })

  it('renders ThemeToggle', () => {
    renderSidebar()
    const toggles = screen.getAllByRole('button', { name: /switch to/i })
    expect(toggles.length).toBeGreaterThanOrEqual(1)
  })

  it('renders mobile toggle button', () => {
    renderSidebar()
    expect(screen.getByRole('button', { name: /open navigation/i })).toBeInTheDocument()
  })

  it('mobile toggle has correct aria attributes', () => {
    renderSidebar()
    const btn = screen.getByRole('button', { name: /open navigation/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(btn).toHaveAttribute('aria-controls', 'sidebar-drawer')
  })
})
