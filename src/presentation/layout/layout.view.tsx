import { AppBar, Box, IconButton, Toolbar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { PropsWithChildren } from 'react'

const TOOLBAR_ARIA_LABEL = 'Toolbar'

/**
 * Main Layout component for the application.
 * @category Layout
 */
export default function Layout(props: PropsWithChildren): JSX.Element {
  const { children } = props

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar enableColorOnDark position='fixed' color='primary' elevation={0}>
        <Toolbar aria-label={TOOLBAR_ARIA_LABEL} variant='dense'>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            disabled
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  )
}
