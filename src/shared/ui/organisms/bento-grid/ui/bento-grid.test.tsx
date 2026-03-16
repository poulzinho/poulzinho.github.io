import { render, screen } from '@testing-library/react'
import ThemeProvider from 'shared/ui/theme/theme-provider'
import BentoGrid from './bento-grid'
import BentoCard from 'shared/ui/molecules/bento-card/ui/bento-card'

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    from: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
  },
}))
vi.mock('gsap/ScrollTrigger', () => ({ default: {} }))

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider>{ui}</ThemeProvider>)

describe('BentoGrid', () => {
  it('renders children', () => {
    renderWithTheme(
      <BentoGrid>
        <BentoCard label='card one'>Content A</BentoCard>
        <BentoCard label='card two'>Content B</BentoCard>
      </BentoGrid>
    )

    expect(screen.getByText('Content A')).toBeInTheDocument()
    expect(screen.getByText('Content B')).toBeInTheDocument()
  })

  it('applies grid and gap classes', () => {
    const { container } = renderWithTheme(
      <BentoGrid cols={3} gap={4}>
        <BentoCard>Item</BentoCard>
      </BentoGrid>
    )

    const grid = container.firstChild as HTMLElement
    expect(grid.className).toContain('grid')
    expect(grid.className).toContain('gap-4')
    expect(grid.className).toContain('grid-flow-dense')
  })
})

describe('BentoCard', () => {
  it('renders as an article', () => {
    renderWithTheme(<BentoCard label='my card'>Hello</BentoCard>)

    const article = screen.getByRole('article', { name: 'my card' })
    expect(article).toBeInTheDocument()
  })

  it('applies colSpan and rowSpan classes', () => {
    renderWithTheme(
      <BentoCard colSpan={2} rowSpan={2} label='big card'>
        Big
      </BentoCard>
    )

    const card = screen.getByRole('article', { name: 'big card' })
    expect(card.className).toContain('col-span-2')
    expect(card.className).toContain('row-span-2')
  })

  it('applies hero variant classes', () => {
    renderWithTheme(
      <BentoCard variant='hero' label='hero card'>
        Hero
      </BentoCard>
    )

    const card = screen.getByRole('article', { name: 'hero card' })
    expect(card.className).toContain('rounded-3xl')
    expect(card.className).toContain('p-8')
  })

  it('forwards extra className', () => {
    renderWithTheme(
      <BentoCard className='custom-class' label='extra'>
        Extra
      </BentoCard>
    )

    const card = screen.getByRole('article', { name: 'extra' })
    expect(card.className).toContain('custom-class')
  })
})
