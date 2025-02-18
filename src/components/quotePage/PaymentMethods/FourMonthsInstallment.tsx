import React, { useMemo } from 'react'
import { Box, Radio, Typography } from '@mui/material'

export type FourMonthsInstallmentProps = {
  selected: boolean
  totalPrice: number
  onSelect: () => void
}

const MONTHS = 4

export const FourMonthsInstallment: React.FC<FourMonthsInstallmentProps> = ({ selected, totalPrice, onSelect }) => {
  const monthlyPrice = useMemo<number>(() => {
    return +(totalPrice / MONTHS).toFixed(2)
  }, [totalPrice])

  return (
    <Box
      sx={{
        position: 'relative',
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
        Easy online setup, you only need debit card.
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

      <Box
        sx={{
          padding: '2px var(--8, 8px)',
          position: 'absolute',
          left: '12px',
          top: '-9px',
          borderRadius: '1111111px',
          background: 'linear-gradient(88deg, #2C1385 -11.35%, #4522C2 116.1%, #53217D 116.11%)',
          boxShadow:
            '0px 3px 4px 0px rgba(85, 85, 85, 0.04), 0px 2px 3px 0px rgba(85, 85, 85, 0.08), 0px 1px 1px 0px rgba(85, 85, 85, 0.12)',
          color: 'var(--WF-Base-White, #FFF)',
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: '400',
          lineHeight: '140%',
        }}
      >
        most popular
      </Box>
    </Box>
  )
}
