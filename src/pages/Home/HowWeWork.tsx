import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { HowWeWorkCard } from './HowWeWorkCard'

export const HowWeWork: React.FC = () => {
  return (
    <Box className='container'>
      <Typography
        sx={{
          textAlign: { lg: 'center' },
          fontSize: { xs: 24, lg: 36 },
          fontWeight: '600',
          lineHeight: { xs: '120%', lg: '112%' },
          letterSpacing: { xs: '-0.24px', lg: '-0.36px' },
          mb: { xs: 4, lg: 6 },
        }}
      >
        How we work
      </Typography>

      <Grid container spacing={{ xs: 2, lg: 4 }}>
        <Grid item xs={12} lg={3}>
          <HowWeWorkCard
            title='STEP 1'
            description={
              <>
                Fill out the short quote form <Link to='/customer'>here</Link>
              </>
            }
            image='step1.png'
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <HowWeWorkCard
            title='STEP 2'
            description='We find correct brand new OEM or OEE glass and update your online quote link ASAP, most cases in minutes.'
            image='step2.png'
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <HowWeWorkCard
            title='STEP 3'
            description='Pay upfront cost of the monthly instalment plan or full credit card payment, then confirm your booking date and location. Everything is done online.'
            image='step3.png'
            showPaymentCards={true}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <HowWeWorkCard
            title='STEP 4'
            description="You'll see booking confirmation from your link with Live tracking, our technician will keep you updated when job is done and you can drive your car."
            image='step4.png'
          />
        </Grid>
      </Grid>
    </Box>
  )
}
