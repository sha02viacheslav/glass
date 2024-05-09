import React from 'react'
import { CardMedia } from '@mui/material'

export const PaymentCards: React.FC = () => {
  return (
    <>
      <CardMedia
        component='img'
        sx={{ height: 16, width: 24 }}
        image={process.env.PUBLIC_URL + '/images/master-card.svg'}
      />
      <CardMedia component='img' sx={{ height: 16, width: 24 }} image={process.env.PUBLIC_URL + '/images/visa.svg'} />
      <CardMedia
        component='img'
        sx={{ height: 16, width: 24 }}
        image={process.env.PUBLIC_URL + '/images/discover.svg'}
      />
      <CardMedia component='img' sx={{ height: 16, width: 24 }} image={process.env.PUBLIC_URL + '/images/amex.svg'} />
      <CardMedia
        component='img'
        sx={{ height: 16, width: 24 }}
        image={process.env.PUBLIC_URL + '/images/union-pay.svg'}
      />
      <CardMedia component='img' sx={{ height: 16, width: 24 }} image={process.env.PUBLIC_URL + '/images/jcb.svg'} />
    </>
  )
}
