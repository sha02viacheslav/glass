import React, { useMemo } from 'react'
import { Box, Radio, Typography } from '@mui/material'

export type TwelveMonthsInstallmentProps = {
  selected: boolean
  totalPrice: number
  onSelect: () => void
}

const MONTHS = 12

export const TwelveMonthsInstallment: React.FC<TwelveMonthsInstallmentProps> = ({ selected, totalPrice, onSelect }) => {
  const monthlyPrice = useMemo<number>(() => {
    return +(totalPrice / MONTHS).toFixed(2)
  }, [totalPrice])

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
            <strong>£{monthlyPrice} Upfront</strong> then {MONTHS - 1}x£{monthlyPrice} a month
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
        Pay £{monthlyPrice} of deposit now and then £{monthlyPrice} for the next {MONTHS - 1} months.
      </Typography>

      <Typography
        sx={{
          textAlign: 'right',
          color: 'var(--Gray-700, #474747)',
          fontSize: { xs: 14, lg: 20 },
          lineHeight: '150%',
          letterSpacing: '-0.14px',
          marginTop: { xs: 4, lg: 6 },
        }}
      >
        Total (inc. VAT): £{totalPrice}
      </Typography>
    </Box>
  )
}
