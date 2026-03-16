import { render, screen } from '@testing-library/react'
import ThemeProvider from 'shared/ui/theme/theme-provider'
import Layout from './layout'

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

const renderLayout = (children?: React.ReactNode) =>
  render(
    <ThemeProvider>
      <Layout>{children}</Layout>
    </ThemeProvider>
  )

describe('Layout', () => {
  it('renders without crashing', () => {
    renderLayout()
  })

  it('renders the sidebar navigation', () => {
    renderLayout()
    const navs = screen.getAllByRole('complementary', { name: /site navigation/i })
    expect(navs.length).toBeGreaterThanOrEqual(1)
  })

  it('renders children inside main', () => {
    renderLayout(<p>Page content</p>)
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })
})
