import React from 'react'
import { Box, CardMedia, Radio, Typography } from '@mui/material'

export type CashPaymentProps = {
  selected: boolean
  totalPrice: number
}

export const CashPayment: React.FC<CashPaymentProps> = ({ selected, totalPrice }) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                Pay in cash (Total inc. VAT <strong>£{totalPrice}</strong>)
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, marginTop: 3, marginBottom: 4 }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/alert-rhombus.svg'}
            />
            <Typography
              sx={{
                color: 'var(--Gray-700, #474747)',
                fontSize: '14px',
                lineHeight: '170%',
              }}
            >
              Please note that if you choose the &apos;pay in cash&apos; option, payment must be made before the
              technician begins work.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}
