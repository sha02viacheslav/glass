import './Customer.css'
import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export type EditQuoteHeaderProps = {
  quoteId: string
  title: string
}

export const EditQuoteHeader: React.FC<EditQuoteHeaderProps> = ({ quoteId, title }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: { xs: 52, lg: 100 },
        zIndex: '1001',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 16px 10px',
        borderBottom: '2px solid var(--Gray-100, #F2F2F3)',
        background: '#fff',
      }}
    >
      <Link to={'/quote/' + quoteId}>
        <CardMedia
          component='img'
          sx={{ width: 24, height: 24 }}
          image={process.env.PUBLIC_URL + '/images/arrow-left.svg'}
        />
      </Link>

      <Typography
        sx={{
          color: 'var(--Gray-600, #6A6B71)',
          fontWeight: '700',
          lineHeight: '140%',
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
