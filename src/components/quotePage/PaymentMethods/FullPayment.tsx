import React from 'react'
import { Box, Radio, Typography } from '@mui/material'
import { PaymentCards } from '@glass/components/PaymentCards'

export type FullPaymentProps = {
  selected: boolean
  totalPrice: number
  onSelect: () => void
}

export const FullPayment: React.FC<FullPaymentProps> = ({ selected, totalPrice, onSelect }) => {
  return (
    <Box
      sx={{
        paddingX: { xs: 3, lg: 6 },
        paddingY: { xs: 4, lg: 8 },
        borderRadius: '4px',
        border: selected ? '2px solid #225FC2' : '',
        background: '#FFF',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
      }}
      onClick={() => {
        if (!selected) onSelect()
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Radio checked={selected} size='small' sx={{ padding: { xs: 0, lg: '2px 0' } }} />
          <Typography
            sx={{
              fontSize: { xs: 18, lg: 24 },
              lineHeight: { xs: '20px', lg: '100%' },
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
          fontSize: { xs: 14, lg: 16 },
          lineHeight: '170%',
          marginTop: 3,
        }}
      >
        Secure online credit or debit card accepted. All card accepted.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: { xs: 4, lg: 6 } }}>
        <PaymentCards />
      </Box>
    </Box>
  )
}
