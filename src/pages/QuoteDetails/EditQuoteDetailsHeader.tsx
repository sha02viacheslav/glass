import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'

export type EditQuoteDetailsHeaderProps = {
  title: string
  onBack: () => void
}

export const EditQuoteDetailsHeader: React.FC<EditQuoteDetailsHeaderProps> = ({ title, onBack }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: { lg: '100px' },
        zIndex: '1001',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0 10px',
        borderBottom: '2px solid var(--Gray-100, #F2F2F3)',
        background: '#fff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className='container'
      >
        <CardMedia
          component='img'
          sx={{ width: 24, height: 24, cursor: 'pointer' }}
          image={process.env.PUBLIC_URL + '/images/arrow-left.svg'}
          onClick={() => onBack()}
        />

        <Typography
          sx={{
            color: 'var(--Gray-600, #6A6B71)',
            fontWeight: '700',
            lineHeight: '22px',
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  )
}
