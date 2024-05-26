import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Quote } from '@glass/models'

export type ReadyQuoteProps = {
  quoteDetails: Quote
}

export const ReadyQuote: React.FC<ReadyQuoteProps> = ({ quoteDetails }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: '12px 12px 24px', lg: '48px 24px' },
        borderRadius: 2,
        background: 'linear-gradient(32deg, #7255DB 43.85%, #4522C2 100.67%)',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Typography
        sx={{
          color: '#fff',
          textAlign: 'center',
          fontSize: { xs: 24, lg: 48 },
          fontWeight: '700',
          lineHeight: { xs: '32px', lg: '64px' },
        }}
      >
        {quoteDetails.customer_f_name}, Your quote for is ready!
      </Typography>
      <Typography
        sx={{
          color: '#fff',
          textAlign: 'center',
          fontSize: { xs: 20, lg: 40 },
          lineHeight: '150%',
          letterSpacing: '-0.2px',
          marginTop: 1,
        }}
      >
        {quoteDetails.make} {quoteDetails?.model}
      </Typography>
      {!!quoteDetails.vehicle_logo_url && (
        <CardMedia
          component='img'
          sx={{ width: 'auto', height: 72, marginTop: { xs: 3, lg: 15 } }}
          image={quoteDetails.vehicle_logo_url}
        />
      )}
      <Box
        sx={{
          display: 'block',
          width: '140%',
          height: { xs: '183px', lg: '366px' },
          position: 'absolute',
          left: '-20%',
          bottom: { xs: '-125px', lg: '-284px' },
          background: 'var(--Dark-Blue---Accent-400, #7255DB)',
          filter: 'blur(12px)',
        }}
      ></Box>
    </Box>
  )
}
