import './Home.css'
import React from 'react'
import { Box, Typography } from '@mui/material'

export const HomeDescription: React.FC = () => {
  return (
    <Box className='container'>
      <Typography
        sx={{
          textAlign: { lg: 'center' },
          fontSize: { xs: 30, lg: 36 },
          fontWeight: '700',
          lineHeight: { xs: '120%', lg: '112%' },
          letterSpacing: { xs: '0.9px', lg: '1.08px' },
          maxWidth: 828,
          mx: { lg: 'auto' },
        }}
      >
        All Brands From Mini Cooper to Range Rover, we got you covered
      </Typography>
      <Typography
        sx={{
          color: 'var(--Gray-700, #474747)',
          textAlign: { lg: 'center' },
          fontSize: { xs: 16, lg: 20 },
          lineHeight: { xs: '170%', lg: '150%' },
          maxWidth: 650,
          mx: { lg: 'auto' },
          mt: { xs: 4, lg: 6 },
        }}
      >
        We offer glass replacement for passenger vehicles and vans.
        <br />
        All jobs are done by professionals at your home, workplace or at our workshop, wherever you please.
      </Typography>
    </Box>
  )
}
