import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'

export const Partners: React.FC = () => {
  return (
    <Box sx={{ background: '#f7f5ff', py: { xs: 6, lg: 16 } }}>
      <Box className='container'>
        <Typography
          sx={{
            color: 'var(--Gray-800, #14151f)',
            textAlign: 'center',
            fontSize: { xs: 24, lg: 36 },
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '140%',
          }}
        >
          We collaborate with <strong>industry-leading partners.</strong>
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: 12, lg: 24 },
            fontWeight: 600,
            lineHeight: '160%',
            letterSpacing: '0.96px',
            textTransform: 'uppercase',
            mt: { xs: 8, lg: 16 },
            mb: { xs: 3, lg: 8 },
          }}
        >
          Best Glue makers in the world
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 80, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/partner1.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 80, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/partner2.png'}
          />
        </Box>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: 12, lg: 24 },
            fontWeight: 600,
            lineHeight: '160%',
            letterSpacing: '0.96px',
            textTransform: 'uppercase',
            mt: { xs: 12, lg: 30 },
          }}
        >
          Premier Partners: Leaders in Glass & Product Manufacturing
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'scroll',
            paddingLeft: '16px',
            width: '100%',
            mt: { xs: 3, lg: 8 },
          }}
        >
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner1.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner2.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner3.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner4.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner5.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner6.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner7.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner8.png'}
          />
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 78, lg: 194 } }}
            image={process.env.PUBLIC_URL + '/images/premier-partner9.png'}
          />
        </Box>
      </Box>
    </Box>
  )
}
