import { render } from '@testing-library/react'
import HomePage from './home-page'

describe('HomePage', () => {
  it('should render the website without crashes', () => {
    render(<HomePage />)
  })
})
