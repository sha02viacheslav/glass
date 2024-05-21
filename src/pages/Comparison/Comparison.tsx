import './Comparison.css'
import React from 'react'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { BeforeAfterType } from '@glass/enums'
import { LifeTime } from '../Home/LifeTime'
import { Testimonials } from '../Home/Testimonials'

export const Comparison: React.FC = () => {
  const theme = useTheme()
  const isLg = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <div className='comparison-page'>
      <Box sx={{ py: { xs: 20, lg: 32 } }}></Box>

      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', lg: 'center' } }}
        className='container'
      >
        <Typography
          sx={{
            color: 'var(--Light-Blue---Primary-600, #133f85)',
            fontSize: { xs: 12, lg: 16 },
            lineHeight: { xs: '130%', lg: '125%' },
            letterSpacing: { xs: '0.84px', lg: '1.12px' },
            textTransform: 'uppercase',
          }}
        >
          Fixglass vs. others
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 24, lg: 72 },
            fontWeight: 700,
            lineHeight: { xs: '130%', lg: '100%' },
            marginTop: { xs: 4, lg: 8 },
          }}
        >
          FixGlass vs Cheap Providers
        </Typography>
        <Typography
          sx={{
            color: 'var(--Gray-600, #6a6b71)',
            fontSize: { xs: 16, lg: 30 },
            lineHeight: { xs: '170%', lg: '100%' },
            marginTop: { xs: 3, lg: 6 },
          }}
        >
          How our service stands out from other cheap alternatives.
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 8, lg: 12 } }}></Box>

      <Box className='container'>
        <div className='comparison-table-container'>
          <table className='comparison-table'>
            <col width={isLg ? 360 : 120} />
            <col width={isLg ? 360 : 160} />
            <col width={isLg ? 360 : 180} />
            <tr>
              <th></th>
              <th>
                <img src={process.env.PUBLIC_URL + '/images/comparison-logo.svg'} className='img-fluid' alt='' />
              </th>
              <th>Other Alternatives</th>
            </tr>
            <tr>
              <td>Booking process</td>
              <td>Flexible booking policy with advance notice for cancellations.</td>
              <td>Cancellations without prior notice are common.</td>
            </tr>
            <tr>
              <td>Glass Selection</td>
              <td>Accurate glass selection through meticulous procedures.</td>
              <td>Fast and sloppy removal of old glass, risking damage to trims and clips.</td>
            </tr>
            <tr>
              <td>Old Glass Removal</td>
              <td>Careful removal of old glass, with no damage to trims and clips.</td>
              <td>Sloppy new glass fitting, lacking proper cleaning, priming, and adhesive application.</td>
            </tr>
            <tr>
              <td>New glass fitting</td>
              <td>
                Thorough and precise fitting of new glass, including proper cleaning, priming, and adhesive application.
              </td>
              <td>Sloppy new glass fitting, typically lacking proper cleaning, priming, and adhesive application.</td>
            </tr>
            <tr>
              <td>Alignment and Sealing</td>
              <td>Attention to detail using rubber blocks for correct alignment and preventing leaks.</td>
              <td>Failure to use rubber blocks for proper alignment, leading to leaks and damage over time.</td>
            </tr>
            <tr>
              <td>Cover Installation</td>
              <td>Professional installation of plastic covers and mirrors, ensuring no further damage.</td>
              <td>Inadequate installation of plastic covers and mirrors, risking further damage.</td>
            </tr>
            <tr>
              <td>Long-Term Risks</td>
              <td>Guaranteed water-tight installation to prevent future issues like rusting.</td>
              <td>Possible water leaks and rusting due to subpar installation practices.</td>
            </tr>
          </table>
        </div>
      </Box>

      <Box sx={{ p: { xs: 8, lg: 16 } }}></Box>

      <LifeTime />

      <Box sx={{ p: { xs: 8, lg: 16 } }}></Box>

      <Partners />

      <Box sx={{ p: { xs: 8, lg: 16 } }}></Box>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

      <Box sx={{ p: { xs: 8, lg: 16 } }}></Box>

      <Box
        sx={{
          px: 4,
          py: { xs: 6, lg: 16 },
          background: 'linear-gradient(94deg, #582991 11.37%, #2c1385 123.87%)',
          display: 'flex',
          justifyContent: { xs: 'flex-start', lg: 'center' },
        }}
        className='monthly-installment'
      >
        <Typography
          sx={{
            textAlign: { xs: 'left', lg: 'center' },
            color: '#fff',
            fontSize: { xs: 20, lg: 48 },
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '150%',
            maxWidth: 760,
          }}
        >
          Monthly 0% interest installments start from <strong>£83</strong> per month
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 8, lg: 16 } }}></Box>

      <Testimonials />

      <Box sx={{ p: { xs: 8, lg: 16 } }}></Box>
    </div>
  )
}
