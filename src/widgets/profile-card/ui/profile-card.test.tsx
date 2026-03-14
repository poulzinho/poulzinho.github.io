import { fireEvent, render, screen } from '@testing-library/react'
import ProfileCard from './profile-card'

vi.mock('react-i18next')

describe('ProfileCard', () => {
  let windowSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    windowSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  })
  afterEach(() => {
    windowSpy.mockRestore()
  })

  it('renders the ProfileCard and its elements', () => {
    render(<ProfileCard />)

    // CARD HEADER
    expect(screen.getByText('paul_initials')).toBeInTheDocument()
    expect(screen.getByText('paul_name')).toBeInTheDocument()
    expect(screen.getByText('paul_position')).toBeInTheDocument()

    // CARD MEDIA
    expect(screen.getByAltText('paul_profile_picture_alt_text')).toBeInTheDocument()

    // CARD CONTENT
    expect(screen.getByText('paul_profile_picture_caption')).toBeInTheDocument()
    expect(screen.getByText('greetings')).toBeInTheDocument()
    expect(screen.getByText('paul_profile_intro')).toBeInTheDocument()
    expect(screen.getByText('paul_profile_description')).toBeInTheDocument()

    // CARD ACTIONS
    const linkedInButton = screen.getByText('linkedin_button_text')
    expect(linkedInButton).toBeInTheDocument()
    expect(linkedInButton.querySelector('svg')).toBeInTheDocument()
    fireEvent.click(linkedInButton)
    expect(windowSpy).toHaveBeenCalledWith(
      'https://www.linkedin.com/in/paul-gualotuna',
      '_blank'
    )
  })
})
