import React from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const InstallmentBenefits: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        padding: { xs: '24px 8px 32px', lg: '48px 8px 64px' },
        flexDirection: 'column',
        alignItems: 'flex-start',
        background: 'url(/images/insurance-claim.png) lightgray center / cover no-repeat',
        backgroundBlendMode: 'normal, darken',
      }}
      className='sec-installment-benefits'
    >
      <Box sx={{}} className='container'>
        <Typography
          sx={{
            color: 'var(--Gray-100, #f2f2f3)',
            fontSize: { xs: 12, lg: 16 },
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '140%',
            letterSpacing: '0.96px',
            textTransform: 'uppercase',
            marginBottom: 3,
          }}
        >
          Installment Benefits
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 24, lg: 48 },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '140%',
            background: 'linear-gradient(90deg, #e8f0fe -5.37%, #bad1f7 106.22%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            maxWidth: 935,
            marginBottom: { xs: 8, lg: 16 },
          }}
        >
          An insurance claim can end up costing you far more than our monthly installments
        </Typography>
        <Box sx={{ width: { xs: 200, lg: 300 }, button: { py: 4 } }}>
          <button className='btn-raised w-100' onClick={() => navigate('/installments')}>
            See how
            <img src={process.env.PUBLIC_URL + '/images/arrow-right.svg'} className='img-fluid' alt='' />
          </button>
        </Box>
      </Box>
    </Box>
  )
}
