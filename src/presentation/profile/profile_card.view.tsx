import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import profilePic from '../../assets/images/profile_pic.jpg'
import { LinkedIn } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const LINKED_IN_URL = 'https://www.linkedin.com/in/paul-gualotuna'

/**
 * Profile card component.
 * @category Profile
 */
export default function ProfileCard(): JSX.Element {
  const { t } = useTranslation()
  return (
    <Card sx={{ maxWidth: 460 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'dodgerblue' }} aria-label='recipe'>
            {t('paul_initials')}
          </Avatar>
        }
        action={<IconButton aria-label='settings'></IconButton>}
        title={t('paul_name')}
        subheader={t('paul_position')}
      />
      <CardMedia
        component='img'
        height='300'
        image={profilePic}
        alt={t('paul_profile_picture_alt_text')}
        title={t('paul_profile_picture_alt_text')}
      />
      <CardContent sx={{ paddingTop: '3px' }}>
        <Typography variant='caption' color='text.secondary'>
          {t('paul_profile_picture_caption')}
        </Typography>
        <Typography
          variant='h5'
          color='text.primary'
          component='div'
          sx={{ marginTop: '6px', marginBottom: '6px' }}
        >
          {t('greetings')}
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ marginBottom: '12px' }}
        >
          {t('paul_profile_intro')}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('paul_profile_description')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant='text'
          onClick={() => window.open(LINKED_IN_URL, '_blank')}
          tabIndex={-1}
          startIcon={<LinkedIn />}
        >
          {t('linkedin_button_text')}
        </Button>
      </CardActions>
    </Card>
  )
}
