import React from 'react'
import { Box, Radio, Typography } from '@mui/material'
import { PaymentCards } from '@glass/components/PaymentCards'

export type FullPaymentProps = {
  selected: boolean
  totalPrice: number
}

export const FullPayment: React.FC<FullPaymentProps> = ({ selected, totalPrice }) => {
  return (
    <Box
      sx={{
        paddingX: 3,
        paddingY: 4,
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Radio checked={selected} size='small' sx={{ padding: 0 }} />
          <Typography
            sx={{
              fontSize: '18px',
              lineHeight: '20px',
              letterSpacing: '-0.18px',
              marginLeft: 2,
            }}
          >
            Pay in full (Total inc. VAT <strong>£{totalPrice}</strong>)
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          color: 'var(--Gray-700, #474747)',
          fontSize: '14px',
          lineHeight: '170%',
          marginTop: 3,
        }}
      >
        Secure online credit or debit card accepted. All card accepted.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
        <PaymentCards />
      </Box>
    </Box>
  )
}
