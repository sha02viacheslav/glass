import React from 'react'
import { Box, CardMedia, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { PlantTree } from '@glass/components/PlantTree'
import { SERVICES } from '@glass/constants'
import { BeforeAfterType } from '@glass/enums'
import { LifeTime } from '../Home/LifeTime'
import { LiveService } from '../Home/LiveService'
import { Testimonials } from '../Home/Testimonials'

export const Services: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <Box sx={{ py: { xs: 20, lg: 32 } }}></Box>

      <Box className='container'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', lg: 'center' },
          }}
        >
          <Typography
            sx={{
              color: 'var(--Light-Blue---Primary-600, #133f85)',
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 12, lg: 16 },
              lineHeight: '130%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            Our services
          </Typography>
          <Typography
            sx={{
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 24, lg: 72 },
              fontWeight: 700,
              lineHeight: { xs: '130%', lg: '110%' },
              marginTop: { xs: 4, lg: 8 },
              maxWidth: 960,
            }}
          >
            Premium Glass Replacement at Your Place
          </Typography>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6a6b71)',
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 16, lg: 30 },
              lineHeight: '170%',
              marginTop: { xs: 3, lg: 6 },
              maxWidth: 738,
            }}
          >
            We source high-quality glass exceeding all safety standards. All existing sensors and heating elements will
            be included. Safely drive again after 1 - 2 hours.
          </Typography>
        </Box>

        <Box sx={{ py: { xs: 3, lg: 16 } }}></Box>

        <Grid container spacing={{ xs: 6, lg: 8 }}>
          {SERVICES.map((service, index) => (
            <Grid item key={index} xs={12} lg={4}>
              <Box
                sx={{
                  borderRadius: '2px',
                  background: '#fff',
                  boxShadow:
                    '0px 4px 15px 0px rgba(147, 147, 147, 0.12), 0px 2px 10px 0px rgba(147, 147, 147, 0.14), 0px 1px 6px 0px rgba(147, 147, 147, 0.18)',
                  height: '100%',
                }}
                onClick={() => navigate('/service-detail/' + service.key)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: '268px',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '2px 2px 0 0',
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                    image={process.env.PUBLIC_URL + '/images/' + service.background}
                  />
                  <Typography
                    sx={{
                      color: '#fff',
                      textAlign: 'center',
                      textShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
                      fontSize: 24,
                      fontWeight: '700',
                      lineHeight: '160%',
                      position: 'inherit',
                    }}
                  >
                    {service.title}
                  </Typography>
                </Box>
                <Box sx={{ px: { xs: 4, lg: 6 }, py: { xs: 4, lg: 8 } }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 18, lg: 24 },
                      fontWeight: '700',
                      lineHeight: '160%',
                    }}
                  >
                    {service.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, lg: 4 }, mt: { xs: 3, lg: 6 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      <CardMedia
                        component='img'
                        sx={{ width: { xs: 24, lg: 32 }, height: { xs: 24, lg: 32 } }}
                        image={process.env.PUBLIC_URL + '/images/car-windshield.svg'}
                      />
                      <Typography
                        sx={{
                          color: 'var(--Gray-700, #474747)',
                          fontSize: { xs: 16, lg: 20 },
                          lineHeight: { xs: '24px', lg: '32px' },
                          letterSpacing: { xs: '-0.16px', lg: '-0.2px' },
                        }}
                      >
                        {service.glass}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      <CardMedia
                        component='img'
                        sx={{ width: { xs: 24, lg: 32 }, height: { xs: 24, lg: 32 } }}
                        image={process.env.PUBLIC_URL + '/images/quality-high.svg'}
                      />
                      <Typography
                        sx={{
                          color: 'var(--Gray-700, #474747)',
                          fontSize: { xs: 16, lg: 20 },
                          lineHeight: { xs: '24px', lg: '32px' },
                          letterSpacing: { xs: '-0.16px', lg: '-0.2px' },
                        }}
                      >
                        {service.quality}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                      <CardMedia
                        component='img'
                        sx={{ width: { xs: 24, lg: 32 }, height: { xs: 24, lg: 32 } }}
                        image={process.env.PUBLIC_URL + '/images/timer.svg'}
                      />
                      <Typography
                        sx={{
                          color: 'var(--Gray-700, #474747)',
                          fontSize: { xs: 16, lg: 20 },
                          lineHeight: { xs: '24px', lg: '32px' },
                          letterSpacing: { xs: '-0.16px', lg: '-0.2px' },
                        }}
                      >
                        {service.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <LifeTime />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Partners />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Box sx={{ margin: '0 16px' }}>
        <LiveService />
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Testimonials />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <PlantTree />

      <Box sx={{ py: { xs: 16, lg: 25 } }}></Box>

      <Chat />

      {/*Remove for now, will check later*/}
      {/*<CaseStudies />*/}
    </Box>
  )
}
