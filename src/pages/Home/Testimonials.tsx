import React from 'react'
import { Box, Typography } from '@mui/material'
import { GoogleReviews } from '@glass/components/Footer/GoogleReviews'

export const Testimonials: React.FC = () => {
  return (
    <Box sx={{ pr: { xs: 0, lg: 4 } }} className='container'>
      <Box
        sx={{
          pr: { xs: 4, lg: 0 },
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: 24, lg: 36 },
            fontWeight: '600',
            lineHeight: { xs: '120%', lg: '112%' },
            letterSpacing: { xs: '-0.24px', lg: '-0.36px' },
            mb: { xs: 4, lg: 6 },
          }}
        >
          Testimonials from our customers
        </Typography>
        <Typography
          sx={{
            color: 'var(--Gray-700, #474747)',
            textAlign: 'center',
            fontSize: { xs: 16, lg: 20 },
            lineHeight: { xs: '160%', lg: '150%' },
            mb: { xs: 8, lg: 12 },
          }}
        >
          We have over{' '}
          <Typography
            component='span'
            sx={{
              background: 'linear-gradient(91deg, #4522C2 25.92%, #2C1385 50.86%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: 18, lg: 24 },
              fontWeight: '600',
              lineHeight: { xs: '160%', lg: '150%' },
            }}
          >
            1000+
          </Typography>{' '}
          satisfied customers. See what they have to say about us.
        </Typography>
      </Box>
      <Box sx={{ pr: { xs: 2, lg: 0 } }}>
        <GoogleReviews />
      </Box>
    </Box>
  )
}
