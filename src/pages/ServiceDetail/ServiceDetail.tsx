import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { Footer } from '@glass/components/Footer'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { QuickContact } from '@glass/components/QuickContact'
import { SERVICES } from '@glass/constants'
import { BeforeAfterType, ServiceKey } from '@glass/enums'
import { Inquiry } from '@glass/models'
import { ProcessItem } from './ProcessItem'

export const ServiceDetail: React.FC = () => {
  const { serviceKey } = useParams()
  const service = SERVICES.find((item) => item.key === serviceKey)
  const [inquiry, setInquiry] = useState<Inquiry | undefined>()

  return (
    <Box className='service-detail-page'>
      <Box sx={{ py: { xs: 20, lg: 32 } }}></Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'flex-start', lg: 'center' },
        }}
        className='container'
      >
        <Typography
          sx={{
            color: 'var(--Gray-600, #6a6b71)',
            textAlign: { xs: 'left', lg: 'center' },
            fontSize: { xs: 12, lg: 16 },
            lineHeight: '130%',
            letterSpacing: '0.84px',
            textTransform: 'uppercase',
          }}
        >
          Our services&nbsp;
          <Typography
            component='span'
            sx={{
              color: 'var(--Light-Blue---Primary-600, #133f85)',
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 12, lg: 16 },
              lineHeight: '130%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            / {service?.title}
          </Typography>
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
          {service?.detailTitle}
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
          We source high-quality glass exceeding all safety standards. All existing sensors and heating elements will be
          included. Safely drive again after 1 - 2 hours.
        </Typography>
      </Box>

      <Box sx={{ py: { xs: 4, lg: 8 } }}></Box>

      <Box sx={{ py: { lg: 16 }, background: { lg: 'var(--Gray-000, #F7F7F8)' } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'flex-start',
            gap: { xs: 12, lg: 24 },
          }}
          className='container'
        >
          <Box
            sx={{
              minWidth: { lg: 420 },
              maxWidth: { lg: 420 },
              px: { lg: 8 },
              py: { lg: 6 },
              borderRadius: '2px',
              background: { lg: '#fff' },
              boxShadow: {
                lg: '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 16, lg: 20 },
                lineHeight: { xs: '150%', lg: '160%' },
                letterSpacing: '-0.16px',
                marginBottom: { xs: 2, lg: 6 },
              }}
            >
              Share your car&apos;s registration number and hit search icon.
            </Typography>
            <Box
              sx={{
                p: { xs: 3, lg: 0 },
                borderRadius: '2px',
                background: { xs: '#fff', lg: 'transparent' },
                boxShadow: {
                  xs: '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
                  lg: 'none',
                },
              }}
            >
              <LicensePlate
                placeholderVal='Enter reg'
                showSearch={true}
                showModel={true}
                handleVehicleDataChange={(data) => setInquiry(data)}
              />
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: { xs: 16, lg: 30, fontWeight: '700' }, lineHeight: { xs: '160%', lg: '107%' } }}
            >
              {service?.processTitle}
            </Typography>
            <Typography
              sx={{
                color: 'var(--Gray-700, #474747)',
                fontSize: { xs: 16, lg: 20 },
                lineHeight: '160%',
                mt: { xs: 2, lg: 6 },
              }}
            >
              {service?.processDescription}
            </Typography>

            <Box sx={{ py: { xs: 5, lg: 8 } }}></Box>

            {!!inquiry && (
              <Box>
                {serviceKey === ServiceKey.WINDSCREEN && (
                  <>
                    <ProcessItem
                      title='BMW G80 M3 Competition smashed windscreen'
                      description="Windscreen has rain/light sensor, camera assist and head-up display. We'll source OEM glass with exact same features."
                      image={process.env.PUBLIC_URL + '/images/windscreen-1.png'}
                    />
                    <ProcessItem
                      title='Cutting old glue'
                      description="We don't have skills for cheap job. We only use premium tools with careful approach to prevent damaging your vehicle."
                      image={process.env.PUBLIC_URL + '/images/windscreen-2.png'}
                      topDescription='Scratchless blade'
                      bottomDescription='Cheap job scratch'
                      showCheckMark={true}
                      showCloseMark={true}
                    />
                    <ProcessItem
                      title='New crash tested urethane applied'
                      description='We apply crash-tested glue, ready for installing your new OEE or OEM windscreen. Safe to drive in 60 min after fitting.'
                      image={process.env.PUBLIC_URL + '/images/windscreen-3.png'}
                    />
                    <ProcessItem
                      title='Brand new windscreen is fitted'
                      description='New windscreen is fitted just like in factory, no water leaks, no loose mouldings, glass and vehicle body has correct gap about 5mm. Looks beautiful!'
                      image={process.env.PUBLIC_URL + '/images/windscreen-4.png'}
                    />
                    <ProcessItem
                      title='Interior mirror attached'
                      description="After new windscreen is installed, we'll then connect all the cables for sensors and re-attach the interior mirror."
                      image={process.env.PUBLIC_URL + '/images/windscreen-5.png'}
                    />
                    <ProcessItem
                      title='Car is safe to drive'
                      description='You can drive the car after 60 minutes of replacement because of our 60 min crash tested glue.'
                      image={process.env.PUBLIC_URL + '/images/windscreen-6.png'}
                    />
                  </>
                )}

                {serviceKey === ServiceKey.DOOR_GLASS && (
                  <>
                    <ProcessItem
                      title='MK7 Golf broken door glass panel removing'
                      description='We begin the process of replacing your door glass by carefully removing the door panel.'
                      image={process.env.PUBLIC_URL + '/images/door-1.png'}
                    />
                    <ProcessItem
                      title='Vacuuming shattered glass'
                      description='The next step involves vacuuming the shattered glass from inside the door and the glass channel for a thorough cleanup.'
                      image={process.env.PUBLIC_URL + '/images/door-2.png'}
                    />
                    <ProcessItem
                      title='New glass fitted and connected to regulator'
                      description='The new glass is expertly fitted and seamlessly connected to the regulator, ensuring it functions just as before.'
                      image={process.env.PUBLIC_URL + '/images/door-3.png'}
                      bottomDescription='Regulator connected'
                    />
                    <ProcessItem
                      title='Placing back the panel'
                      description='Reattaching the panel to its original position, ensuring it is restored to its previous state.'
                      image={process.env.PUBLIC_URL + '/images/door-4.png'}
                    />
                    <ProcessItem
                      title='Door glass works same as before'
                      description='New door glass is replaced at it works same as before the damage as you can see on the video below'
                      video='1750125069769056477'
                    />
                  </>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {!!inquiry && (
        <>
          <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

          <OurMethod beforeAfterType={BeforeAfterType.ALL} />

          <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

          <QuickContact showReg={true} />

          <Footer />
        </>
      )}

      <Box sx={{ py: { xs: 16, lg: 25 } }}></Box>

      <Chat />
    </Box>
  )
}
