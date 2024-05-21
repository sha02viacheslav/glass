import React from 'react'
import { Box, Typography } from '@mui/material'

export type PlantTreeProps = {}

export const PlantTree: React.FC<PlantTreeProps> = ({}) => {
  return (
    <Box
      sx={{
        px: 6,
        py: { xs: 8, lg: 32 },
        background: 'url(/images/tree.png) lightgray center / cover no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          color: '#fff',
          fontSize: { xs: 12, lg: 16 },
          lineHeight: { xs: '140%', lg: '150%' },
          letterSpacing: '0.96px',
          textTransform: 'uppercase',
        }}
      >
        We Care about nature
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Inter',
          fontSize: { xs: 48, lg: 60 },
          fontWeight: 700,
          lineHeight: { xs: '140%', lg: '133%' },
          background: 'linear-gradient(90deg, #34a853 100%, #4af867 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginTop: { xs: 4, lg: 6 },
        }}
      >
        100+
      </Typography>
      <Typography
        sx={{
          color: '#fff',
          fontSize: { xs: 16, lg: 48 },
          fontWeight: 700,
          lineHeight: { xs: '140%', lg: '130%' },
          letterSpacing: '1.28px',
        }}
      >
        Trees planted by Fixglass.
      </Typography>
      <Typography
        sx={{
          color: 'var(--Gray-000, #f7f7f8)',
          textAlign: 'center',
          fontSize: { xs: 16, lg: 24 },
          fontWeight: 300,
          lineHeight: '170%',
          marginTop: { xs: 8, lg: 16 },
          maxWidth: 527,
        }}
      >
        Trees are vital for our planet, giving oxygen, storing carbon, and supporting wildlife. With each replacement,
        we donate to plant new trees, helping create a greener future.
      </Typography>
    </Box>
  )
}
