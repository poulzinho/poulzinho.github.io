import { render, screen } from '@testing-library/react'
import Label from './label'

describe('Label', () => {
  it('renders children', () => {
    render(<Label>Languages</Label>)
    expect(screen.getByText('Languages')).toBeInTheDocument()
  })

  it('renders as the specified element', () => {
    render(<Label as='h3'>Section</Label>)
    expect(screen.getByRole('heading', { level: 3, name: 'Section' })).toBeInTheDocument()
  })

  it('applies muted opacity when muted is true', () => {
    render(<Label muted>Muted</Label>)
    expect(screen.getByText('Muted').className).toContain('opacity-50')
  })

  it('applies tracking and uppercase classes', () => {
    render(<Label>Style</Label>)
    const el = screen.getByText('Style')
    expect(el.className).toContain('uppercase')
    expect(el.className).toContain('tracking-widest')
  })

  it('forwards extra className', () => {
    render(<Label className='custom'>X</Label>)
    expect(screen.getByText('X').className).toContain('custom')
  })
})
