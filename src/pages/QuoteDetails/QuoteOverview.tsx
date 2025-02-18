import React from 'react'
import { Box, CardMedia, Grid, Typography } from '@mui/material'
import { LicensePlate } from '@glass/components/LicensePlate'
import { WindowSelector } from '@glass/components/WindowSelector'
import { CarType, EditQuotePage } from '@glass/enums'
import { Quote } from '@glass/models'

export type QuoteOverviewProps = {
  selectedCarType: CarType
  quoteDetails: Quote
  onEdit: (value: EditQuotePage) => void
}

export const QuoteOverview: React.FC<QuoteOverviewProps> = ({ selectedCarType, quoteDetails, onEdit }) => {
  return (
    <Grid container spacing={{ xs: 16, lg: 12 }}>
      <Grid item xs={12} lg={6}>
        <Box>
          <Typography sx={{ fontSize: { xs: 16, lg: 30 }, lineHeight: '170%' }}>
            You can edit any of your details below by tapping on it.
          </Typography>

          <Box sx={{ mt: 6 }}>
            <Typography
              sx={{
                fontWeight: '700',
                lineHeight: '170%',
              }}
            >
              Your car{' '}
              <Typography
                component='span'
                sx={{
                  color: 'var(--Gray-600, #6A6B71)',
                  lineHeight: '170%',
                }}
              >
                (This can&apos;t be changed)
              </Typography>
            </Typography>

            <Box
              sx={{
                padding: { xs: 3, lg: 0 },
                background: { xs: '#fff', lg: 'transparent' },
                borderRadius: '2px',
                marginTop: 2,
              }}
            >
              <Box sx={{ width: '94px', marginTop: 3 }}>
                <Box sx={{ zoom: { xs: 0.3, lg: 0.75 } }}>
                  <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {!!quoteDetails.vehicle_logo_url && (
                  <CardMedia
                    component='img'
                    sx={{ width: 'auto', height: { xs: 20, lg: 45 } }}
                    image={quoteDetails.vehicle_logo_url}
                  />
                )}
                <Typography
                  sx={{
                    color: 'var(--Gray-800, #14151F)',
                    fontSize: { xs: 14, lg: 30 },
                    fontWeight: '400',
                    lineHeight: '150%',
                  }}
                >
                  {quoteDetails?.make} {quoteDetails?.model}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} lg={6}>
        <Box>
          <Box
            sx={{
              borderRadius: '2px',
              background: '#fff',
              boxShadow:
                '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
              padding: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: '600', lineHeight: '140%' }}>Broken glass details</Typography>
              {/* <CardMedia
            component='img'
            sx={{ width: 24, height: 24, cursor: 'pointer' }}
            image={process.env.PUBLIC_URL + '/images/chevron-right.svg'}
            onClick={() => onEdit(EditQuotePage.GLASS)}
          /> */}
            </Box>
            <Box sx={{ marginTop: 3 }}>
              <WindowSelector
                disabled={true}
                carType={selectedCarType}
                registrationNumber={quoteDetails.registration_number}
                selectedGlasses={quoteDetails.glass_location}
                id='map_win_overview'
              />
            </Box>
            <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: 14, lineHeight: '140%', marginTop: 3 }}>
              {quoteDetails.glass_location.length} glass selected ({quoteDetails.glass_location.join(', ')})
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: '2px',
              background: '#fff',
              boxShadow:
                '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
              padding: 3,
              marginTop: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: '600', lineHeight: '140%' }}>Your comment and images info</Typography>
              <CardMedia
                component='img'
                sx={{ width: 24, height: 24, cursor: 'pointer' }}
                image={process.env.PUBLIC_URL + '/images/chevron-right.svg'}
                onClick={() => onEdit(EditQuotePage.COMMENT_IMAGES)}
              />
            </Box>
            {!!quoteDetails.customer_attachments.length ? (
              <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: 14, lineHeight: '140%', marginTop: 3 }}>
                You added {quoteDetails.customer_attachments.length} image
                {quoteDetails.customer_attachments.length > 1 ? 's' : ''}.
              </Typography>
            ) : (
              <Box
                sx={{
                  px: 4,
                  py: 3,
                  borderRadius: '4px',
                  border: '1px solid var(--Yellow---Semantic-500, #FBBC05)',
                  background: '#FFF9C6',
                  mt: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <CardMedia
                    sx={{ width: 24, height: 24 }}
                    image={process.env.PUBLIC_URL + '/images/alert-rhombus.svg'}
                  />
                  <Typography
                    sx={{
                      color: 'var(--WF-Base-800, #2D3648)',
                      fontWeight: '500',
                      lineHeight: '150%',
                      letterSpacing: '-0.16px',
                    }}
                  >
                    You didn&apos;t added any image
                  </Typography>
                </Box>{' '}
                <Typography
                  sx={{
                    color: 'var(--Gray-700, #474747)',
                    lineHeight: '150%',
                    letterSpacing: '-0.16px',
                    mt: 1,
                  }}
                >
                  It will take longer for us to make the quote. You can add images here.
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              borderRadius: '2px',
              background: '#fff',
              boxShadow:
                '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
              padding: 3,
              marginTop: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: '600', lineHeight: '140%' }}>Personal info</Typography>
              <CardMedia
                component='img'
                sx={{ width: 24, height: 24, cursor: 'pointer' }}
                image={process.env.PUBLIC_URL + '/images/chevron-right.svg'}
                onClick={() => onEdit(EditQuotePage.PERSONAL_INFO)}
              />
            </Box>
            <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: 14, lineHeight: '140%', marginTop: 3 }}>
              You can check all of you personal info here.
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: '2px',
              background: '#fff',
              boxShadow:
                '0px 3px 8px 0px rgba(45, 45, 45, 0.08), 0px 2px 4px 0px rgba(45, 45, 45, 0.10), 0px 1px 2px 0px rgba(45, 45, 45, 0.12)',
              padding: 3,
              marginTop: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: '600', lineHeight: '140%' }}>Repair date, time and location</Typography>
              <CardMedia
                component='img'
                sx={{ width: 24, height: 24, cursor: 'pointer' }}
                image={process.env.PUBLIC_URL + '/images/chevron-right.svg'}
                onClick={() => onEdit(EditQuotePage.DATE_LOCATION)}
              />
            </Box>
            <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: 14, lineHeight: '140%', marginTop: 3 }}>
              You can see or change your repair location date time here.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
