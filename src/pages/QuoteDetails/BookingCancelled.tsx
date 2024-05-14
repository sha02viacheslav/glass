import React from 'react'
import { Box, CardMedia, Link as MuiLink, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { PHONE_NUMBER } from '@glass/constants'

export type BookingCancelledProps = {
  totalPrice: number
}

export const BookingCancelled: React.FC<BookingCancelledProps> = ({ totalPrice }) => {
  return (
    <Box>
      <Typography sx={{ textAlign: 'center', fontSize: 24, lineHeight: '120%', letterSpacing: '-0.24px', mb: 4 }}>
        Thank you for considering our service!
      </Typography>

      <Box
        sx={{
          borderRadius: '2px',
          background: '#fff',
          padding: 4,
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: '600',
            lineHeight: '160%',
            letterSpacing: '-0.16px',
          }}
        >
          You will receive receive refund soon!
        </Typography>
        <CardMedia
          component='img'
          sx={{ width: 96, height: 96, mt: 3 }}
          image={process.env.PUBLIC_URL + '/images/refund.png'}
        ></CardMedia>
        <Typography
          sx={{
            color: 'var(--Gray-600, #6A6B71)',
            textAlign: 'center',
            fontSize: 14,
            lineHeight: '160%',
            letterSpacing: '-0.14px',
            mt: 6,
          }}
        >
          Amount to be refunded
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: 48,
            fontWeight: '700',
            lineHeight: '120%',
            letterSpacing: '0.48px',
            mt: 1,
          }}
        >
          £{totalPrice}
        </Typography>
        <Typography
          sx={{
            color: 'var(--Gray-700, #474747)',
            textAlign: 'center',
            lineHeight: '160%',
            letterSpacing: '-0.16px',
            mt: 8,
          }}
        >
          If you change your mind or need our service in the future feel free to{' '}
          <MuiLink href={`tel:${PHONE_NUMBER}`}>
            <strong>Call us!</strong>
          </MuiLink>
        </Typography>
      </Box>

      <Box sx={{ mt: 16 }}>
        <Link to='/'>
          <button type='button' className='btn-raised w-100'>
            Go to homepage
          </button>
        </Link>
      </Box>
    </Box>
  )
}
