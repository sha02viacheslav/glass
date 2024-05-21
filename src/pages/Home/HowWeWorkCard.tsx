import React, { ReactNode } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { PaymentCards } from '@glass/components/PaymentCards'

export type HowWeWorkCardProps = {
  title: string
  description: string | ReactNode
  image: string
  showPaymentCards?: boolean
}

export const HowWeWorkCard: React.FC<HowWeWorkCardProps> = ({
  title,
  description,
  image,
  showPaymentCards = false,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'row', lg: 'column-reverse' },
        gap: '10px',
        borderRadius: '0px 2px 2px 0px',
        borderLeft: { xs: '4px solid #133f85', lg: 'none' },
        background: '#fff',
        boxShadow:
          '0px 4px 15px 0px rgba(161, 161, 161, 0.08), 0px 2px 10px 0px rgba(161, 161, 161, 0.1), 0px 1px 6px 0px rgba(161, 161, 161, 0.12)',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 16px 16px 24px',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <Typography
          sx={{
            color: 'var(--Gray-600, #6a6b71)',
            fontSize: '12px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '130%',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            lineHeight: '130%',
            a: {
              textDecoration: 'none',
            },
          }}
        >
          {description}
        </Typography>
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: { xs: '82px', lg: '100%' },
          height: { xs: '100%', lg: 260 },
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        className='img-wrap'
      >
        <CardMedia
          component='img'
          sx={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center' }}
          image={process.env.PUBLIC_URL + '/images/' + image}
        />
        {showPaymentCards && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(6, 1fr)' },
              gap: '4px',
            }}
          >
            <PaymentCards />
          </Box>
        )}
      </Box>
    </Box>
  )
}
