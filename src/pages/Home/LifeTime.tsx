import React from 'react'
import { Box, Typography } from '@mui/material'

export const LifeTime: React.FC = () => {
  return (
    <Box className='container'>
      <Box
        sx={{
          borderRadius: '2px',
          boxShadow:
            '0px 4px 17px 0px rgba(147, 147, 147, 0.04),  0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
        className='sec-life-time'
      >
        <Box
          sx={{
            height: { xs: 197, lg: 'auto' },
            width: { xs: 'auto', lg: 444 },
            background: {
              xs: 'url(/images/high-angle-man-driving.png) lightgray center / cover no-repeat',
              lg: 'url(/images/high-angle-man-driving-desktop.png) lightgray center / cover no-repeat',
            },
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            borderRadius: '2px 2px 0 0',
          }}
          className='sec-header'
        >
          <Typography
            sx={{
              display: { xs: 'block', lg: 'none' },
              fontSize: '30px',
              fontWeight: 700,
              lineHeight: '140%',
              backgroundImage: 'linear-gradient(90deg, #e8f0fe -5.37%, #bad1f7 106.22%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Life time guarantee
          </Typography>
          <Typography
            sx={{
              display: { xs: 'block', lg: 'none' },
              color: 'var(--Gray-100, #f2f2f3)',
              fontFeatureSettings: "'calt' off",
              fontFamily: 'Nunito Sans',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%',
              letterSpacing: '0.96px',
              textTransform: 'uppercase',
              maxWidth: '230px',
              marginTop: '12px',
            }}
          >
            Lifetime Peace of Mind for Your Car&apos;s Glass Repair
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 4, lg: 16 }, background: '#fff' }}>
          <Typography
            sx={{
              display: { xs: 'none', lg: 'block' },
              fontSize: 36,
              fontWeight: 700,
              lineHeight: '140%',
            }}
          >
            Life time guarantee
          </Typography>
          <Typography
            sx={{
              display: { xs: 'none', lg: 'block' },
              color: 'var(--Gray-700, #474747)',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '140%',
              letterSpacing: '0.96px',
              textTransform: 'uppercase',
              marginTop: 3,
            }}
          >
            Lifetime Peace of Mind for Your Car&apos;s Glass Repair
          </Typography>
          <Box
            sx={{
              mt: { xs: 0, lg: 12 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 8,
            }}
            className='sec-content'
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
              className='sec-content-item'
            >
              <img src={process.env.PUBLIC_URL + '/images/life-time1.svg'} className='img-fluid' alt='' />
              <Typography
                sx={{
                  fontSize: { xs: 16, lg: 20 },
                  lineHeight: '150%',
                  letterSpacing: '-0.16px',
                }}
              >
                No water leaks in the repaired area
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
              className='sec-content-item'
            >
              <img src={process.env.PUBLIC_URL + '/images/life-time2.svg'} className='img-fluid' alt='' />
              <Typography
                sx={{
                  fontSize: { xs: 16, lg: 20 },
                  lineHeight: '150%',
                  letterSpacing: '-0.16px',
                }}
              >
                No damage to interior plastic, trim, or upholstery as a result of the repair.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
              className='sec-content-item'
            >
              <img src={process.env.PUBLIC_URL + '/images/life-time3.svg'} className='img-fluid' alt='' />
              <Typography
                sx={{
                  fontSize: { xs: 16, lg: 20 },
                  lineHeight: '150%',
                  letterSpacing: '-0.16px',
                }}
              >
                No damage to exterior paint or finish caused by the repair work.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
