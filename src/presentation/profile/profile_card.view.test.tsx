import { fireEvent, render, screen } from '@testing-library/react'
import ProfileCard from 'presentation/profile/profile_card.view.tsx'

jest.mock('react-i18next')

describe('ProfileCard', () => {
  let windowSpy: jest.SpyInstance

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
  })
  afterEach(() => {
    windowSpy.mockRestore()
  })

  it('renders the ProfileCard and its elements', () => {
    render(<ProfileCard />)

    // CARD HEADER
    // check that the avatar with the PG initials is rendered
    expect(screen.getByText('paul_initials')).toBeInTheDocument()

    // check that the name is rendered
    expect(screen.getByText('paul_name')).toBeInTheDocument()

    // check that job position is rendered
    expect(screen.getByText('paul_position')).toBeInTheDocument()

    // CARD MEDIA
    // check that the profile picture is rendered
    expect(
      screen.getByAltText('paul_profile_picture_alt_text')
    ).toBeInTheDocument()

    // CARD CONTENT
    // check that the profile picture's caption is rendered
    expect(screen.getByText('paul_profile_picture_caption')).toBeInTheDocument()

    // check that the greetings message is rendered
    expect(screen.getByText('greetings')).toBeInTheDocument()

    // check that the profile intro is rendered
    expect(screen.getByText('paul_profile_intro')).toBeInTheDocument()

    // check that the profile description is rendered
    expect(screen.getByText('paul_profile_description')).toBeInTheDocument()

    // CARD ACTIONS
    // check that the LinkedIn button is rendered
    const linkedInButton = screen.getByText('linkedin_button_text')
    expect(linkedInButton).toBeInTheDocument()
    // check that the LinkedIn icon is rendered
    expect(linkedInButton.querySelector('svg')).toBeInTheDocument()
    // check that the LinkedIn button redirects to the correct URL
    fireEvent.click(linkedInButton)
    expect(windowSpy).toHaveBeenCalledWith(
      'https://www.linkedin.com/in/paul-gualotuna',
      '_blank'
    )
  })
})
