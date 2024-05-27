import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export type CustomerHeaderProps = {
  title: string
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ title }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: { xs: 52, lg: 100 },
        zIndex: '1001',
        padding: { xs: '18px 0 10px', lg: '32px 0 24px' },
        borderBottom: '2px solid var(--Gray-100, #F2F2F3)',
        background: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className='container'>
        <Link to='/'>
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: 22, cursor: 'pointer' }}
            image={process.env.PUBLIC_URL + '/images/logo.png'}
          />
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontWeight: '700', lineHeight: '22px' }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
