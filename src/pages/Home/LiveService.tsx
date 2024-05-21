import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'

export const LiveService: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        paddingRight: '16px',
        alignItems: 'stretch',
        gap: { xs: 6, lg: 15 },
        borderRadius: '2px',
        background: '#fff',
        boxShadow:
          '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
      }}
    >
      <CardMedia
        component='img'
        image={process.env.PUBLIC_URL + '/images/live-service-bg1.png'}
        sx={{
          width: { xs: 146, lg: 276 },
          height: { xs: 'auto', lg: 276 },
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          padding: { xs: 'var(--16, 16px) 0px', lg: '64px 0' },
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 'var(--8, 8px)',
          flex: '1 0 0',
          alignSelf: 'stretch',
        }}
      >
        <Typography
          sx={{
            color: 'var(--Gray-800, #14151f)',
            fontSize: { xs: 16, lg: 36 },
            fontWeight: '700',
            lineHeight: '140%',
            textTransform: 'uppercase',
          }}
        >
          Live Service Tracking
        </Typography>
        <Typography
          sx={{
            color: 'var(--Gray-600, #6a6b71)',
            fontSize: { xs: 16, lg: 24 },
            fontWeight: '400',
            lineHeight: '170%',
            letterSpacing: '-0.16px',
            marginTop: '8px',
          }}
        >
          You are able to track our specialist live as they come to you. Know exactly when they&apos;ll arrive, like
          Uber.
        </Typography>
      </Box>
    </Box>
  )
}
