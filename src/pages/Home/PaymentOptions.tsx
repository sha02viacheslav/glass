import React from 'react'
import { Box, Typography } from '@mui/material'
import { PaymentOptionsList } from './PaymentOptionsList'

export const PaymentOptions: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        padding: { xs: '32px 16px 48px 16px', lg: '64px 16px 64px 16px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'flex-start', lg: 'center' },
        gap: { xs: 6, lg: 8 },
        background: 'linear-gradient(168deg, #081f44 -10.29%, #150844 104.32%)',
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          textShadow: '0px 1px 2px rgba(51, 6, 136, 0.16)',
          fontSize: { xs: 30, lg: 36 },
          fontWeight: 700,
          lineHeight: { xs: '130%', lg: '155%' },
          background: 'linear-gradient(90deg, #e8f0fe -5.37%, #bad1f7 106.22%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Our payment options
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, lg: 15 } }}>
        <PaymentOptionsList
          title='Monthly payments'
          icon='payment-options-monthly.svg'
          descriptions={[
            'fast and easy setup with your debit card',
            '0% interest installment plan',
            'Pay a small deposit to secure your booking',
          ]}
        />
        <PaymentOptionsList
          title='Debit or credit card online payment'
          icon='payment-options-card.svg'
          descriptions={['We accept all major credit and debit cards']}
          showPaymentCards={true}
        />
      </Box>
      <Typography
        sx={{
          textAlign: { xs: 'left', lg: 'center' },
          color: 'var(--Gray-200, #EAEAEB)',
          lineHeight: '150%',
        }}
      >
        If you want to find out more, don&apos;t hesitate to call sales at <strong>07400 400469</strong>
      </Typography>
    </Box>
  )
}
