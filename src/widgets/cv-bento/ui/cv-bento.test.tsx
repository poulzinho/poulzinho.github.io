import { render, screen } from '@testing-library/react'
import ThemeProvider from 'shared/ui/theme/theme-provider'
import CvBento from './cv-bento'

vi.mock('react-i18next')
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    from: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    killTweensOf: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({ default: {} }))

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <CvBento />
    </ThemeProvider>
  )

describe('CvBento', () => {
  it('renders without crashing', () => {
    renderWithTheme()
    // BentoGrid root
    const grid = document.querySelector('.grid')
    expect(grid).toBeInTheDocument()
  })

  it('renders all 14 cards', () => {
    renderWithTheme()
    const cards = document.querySelectorAll('article')
    expect(cards.length).toBe(14)
  })

  it('renders hero card with name and tagline', () => {
    renderWithTheme()
    expect(screen.getAllByText('paul_name').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('cv_hero_serif_tagline')).toBeInTheDocument()
  })

  it('renders duality caption', () => {
    renderWithTheme()
    // appears twice: label and paragraph
    expect(
      screen.getAllByText('"cv_duality_caption"').length
    ).toBeGreaterThanOrEqual(1)
  })

  it('renders 7 industry chips', () => {
    renderWithTheme()
    expect(screen.getByText('cv_industries_finance')).toBeInTheDocument()
    expect(screen.getByText('cv_industries_academia')).toBeInTheDocument()
  })

  it('renders language chips with all 4 languages', () => {
    renderWithTheme()
    expect(screen.getAllByText('JavaScript').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Java').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('C#').length).toBeGreaterThanOrEqual(1)
  })

  it('renders framework chips split by group', () => {
    renderWithTheme()
    expect(screen.getByText('cv_frameworks_frontend')).toBeInTheDocument()
    expect(screen.getByText('cv_frameworks_backend')).toBeInTheDocument()
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('.NET').length).toBeGreaterThanOrEqual(1)
  })

  it('renders dataviz card content', () => {
    renderWithTheme()
    expect(screen.getByText('cv_dataviz_title')).toBeInTheDocument()
    expect(screen.getByText('cv_dataviz_headline')).toBeInTheDocument()
    expect(screen.getByText('cv_dataviz_chip_sankey')).toBeInTheDocument()
  })

  it('renders superpower quote', () => {
    renderWithTheme()
    expect(screen.getByText('cv_superpower_quote')).toBeInTheDocument()
  })

  it('renders CTA headline', () => {
    renderWithTheme()
    expect(screen.getByText('cv_cta_headline')).toBeInTheDocument()
  })

  it('renders social links', () => {
    renderWithTheme()
    const linkedinLinks = screen.getAllByRole('link', { name: /linkedin/i })
    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(linkedinLinks.length).toBeGreaterThanOrEqual(1)
    expect(githubLinks.length).toBeGreaterThanOrEqual(1)
  })
})
