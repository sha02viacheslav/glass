import React from 'react'
import { Box, Radio, Typography } from '@mui/material'
import { Offer } from '@glass/models'

export type OrderLinesProps = {
  orderLines: Offer[]
}

export const OrderLines: React.FC<OrderLinesProps> = ({ orderLines }) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {orderLines.map((element, index) => (
          <Box
            key={index}
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
                <Radio checked={true} size='small' sx={{ padding: 0 }} />
                <Typography
                  sx={{
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '-0.32px',
                    marginLeft: 2,
                  }}
                >
                  {element.product}
                </Typography>
              </Box>
              <Typography
                sx={{
                  background: 'linear-gradient(90deg, #4522C2 0%, #8F00FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  component='span'
                  sx={{
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.12)',
                    fontFamily: 'Inter',
                    fontSize: '18px',
                    fontWeight: '700',
                    lineHeight: '20px',
                    background: 'linear-gradient(90deg, #4522C2 0%, #8F00FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  £
                </Typography>
                {(element.price_subtotal / 4).toFixed(2)} Upfront
              </Typography>
            </Box>

            <Typography
              sx={{
                color: 'var(--Gray-700, #474747)',
                fontSize: '14px',
                lineHeight: '140%',
                marginTop: 4,
              }}
            >
              Then pay 3x£100 a month or <strong>total £{element.price_subtotal.toFixed(2)}</strong> (inc VAT).
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}
