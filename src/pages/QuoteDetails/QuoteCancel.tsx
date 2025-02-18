import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { OurMethod } from '@glass/components/OurMethod'
import { PHONE_NUMBER } from '@glass/constants'
import { BeforeAfterType } from '@glass/enums'

export const QuoteCancel: React.FC = ({}) => {
  return (
    <Box>
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: { xs: 24, lg: 36 },
          lineHeight: '120%',
          letterSpacing: '-0.24px',
          mb: { xs: 4, lg: 8 },
        }}
      >
        Choosing the right repair can be though
      </Typography>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} showTitle={false} showVideos={false} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '2px',
          background: 'linear-gradient(94deg, #582991 11.37%, #2C1385 123.87%), #F7F9FC',
          boxShadow:
            '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
          padding: { xs: '8px 16px 16px', lg: '32px 16px 48px' },
        }}
      >
        <Typography
          sx={{
            color: '#fff',
            textAlign: 'center',
            fontSize: { xs: 24, lg: 36 },
            fontWeight: '600',
            lineHeight: '160%',
            letterSpacing: '-0.24px',
          }}
        >
          Get special offer
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: { xs: 16, lg: 24 },
            textAlign: 'center',
            lineHeight: '160%',
            letterSpacing: '-0.16px',
            mt: 1,
            mb: { xs: 6, lg: 12 },
            maxWidth: 426,
          }}
        >
          Contact our agents to see if we can modify offer according to your needs
        </Typography>
        <Box sx={{ maxWidth: 358 }}>
          <a href={`tel:${PHONE_NUMBER}`} className='btn-raised w-100'>
            <CardMedia
              component='img'
              sx={{ width: 24, height: 24 }}
              image={process.env.PUBLIC_URL + '/images/phone-white.svg'}
            ></CardMedia>
            Call us to see what we can do
          </a>
        </Box>
      </Box>
    </Box>
  )
}
