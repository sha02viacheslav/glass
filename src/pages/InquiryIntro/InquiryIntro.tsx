import React, { useEffect, useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { BeforeAfterType } from '@glass/enums'
import { Inquiry } from '@glass/models'
import { getInquiryService } from '@glass/services/apis/get-inquiry.service'
import { CustomerHeader } from '../Customer/CustomerHeader'
import { InstallmentBenefits } from '../Home/InstallmentBenefits'
import { Testimonials } from '../Home/Testimonials'

export const InquiryIntro: React.FC = () => {
  const navigate = useNavigate()
  const { licenseNum } = useParams()

  const [inquiry, setInquiry] = useState<Inquiry | undefined>()

  const fetchVehData = (license: string | undefined) => {
    if (!!license) {
      // fetch vehicle data
      trackPromise(
        getInquiryService(license)
          .then((res) => {
            if (res.success) {
              setInquiry(res.data)
            }
          })
          .catch(() => {}),
      )
    }
  }

  const directToCustomer = () => {
    navigate('/customer/' + (licenseNum || ''))
  }

  useEffect(() => {
    fetchVehData(licenseNum)
  }, [licenseNum])

  return (
    <>
      <CustomerHeader title='Get a quote' />

      <Box className='inquiry-intro-page'>
        <Box sx={{ py: { xs: 16, lg: 32 } }}></Box>

        <Box
          sx={{
            padding: '0 16px',
            margin: 'auto',
            maxWidth: { xs: 300, lg: 809 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          className='about-your-car'
        >
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: 'auto', maxWidth: { xs: 270 } }}
            image={
              inquiry?.step_1?.vehicle_logo_url ||
              process.env.PUBLIC_URL + '/images/mechanics-checking-planning-workshop.png'
            }
          />
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: { xs: 20, lg: 48 },
              fontWeight: '700',
              lineHeight: '140%',
              marginTop: { xs: 6, lg: 12 },
            }}
          >
            We need to ask few details about your {inquiry?.Make + ' ' + inquiry?.Model || 'car'}
          </Typography>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6a6b71)',
              textAlign: 'center',
              fontSize: { xs: 16, lg: 30 },
              fontWeight: '400',
              lineHeight: '140%',
              marginTop: { xs: 3, lg: 6 },
            }}
          >
            It&apos;ll take less than 5 minutes of your time
          </Typography>
        </Box>

        <Box sx={{ py: 8 }}></Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='container'>
          <Box sx={{ width: { xs: '100%', lg: 400 } }} className='lets-start'>
            <button className='btn-raised w-100' onClick={() => directToCustomer()}>
              Let&apos;s start
            </button>
            <Box
              sx={{
                color: 'var(--Gray-700, #474747)',
                fontSize: { xs: 16, lg: 20 },
                lineHeight: '130%',
                marginTop: 3,
                textAlign: 'center',
                a: {
                  color: 'var(--Light-Blue---Primary-500, #225fc2)',
                  fontWeight: '600',
                  textDecoration: 'none',
                },
              }}
              className='process-link'
            >
              Find out more about our process <Link to='/process'>here</Link>
            </Box>
          </Box>
        </Box>

        <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

        <Box className='container'>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: { xs: 30, lg: 36 },
                fontWeight: '700',
                lineHeight: '120%',
                letterSpacing: '-0.3px',
              }}
            >
              Want to know more about our service?
            </Typography>
            <Typography
              sx={{
                color: 'var(--Gray-700, #474747)',
                textAlign: 'center',
                fontSize: { xs: 16, lg: 20 },
                lineHeight: '170%',
                marginTop: 6,
                maxWidth: 490,
              }}
            >
              We Guarantee a seamless install, making your windscreen look like new again
            </Typography>
          </Box>
        </Box>

        <Box sx={{ py: { xs: 8, lg: 12 } }}></Box>

        <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

        <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

        <Box sx={{ background: { lg: '#fff' }, py: { lg: 12 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='container'>
            <Box sx={{ width: { xs: '100%', lg: 650 } }}>
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: { xs: 24, lg: 36 },
                  fontWeight: '600',
                  lineHeight: '150%',
                }}
              >
                Drive Away Safely in 60 minutes After Installation!
              </Typography>
              <Typography
                sx={{
                  color: 'var(--Gray-700, #474747)',
                  textAlign: 'center',
                  fontSize: { xs: 16, lg: 20 },
                  fontWeight: '600',
                  lineHeight: '170%',
                  marginTop: 4,
                }}
              >
                We use premium crash-tested SikaTack® DRIVE glue, which sets quickly and is guaranteed to stay in place
                once set
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

        <InstallmentBenefits />

        <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

        <Partners />

        <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

        <Testimonials />

        <Box sx={{ py: { xs: 16, lg: 25 } }}></Box>
      </Box>
    </>
  )
}
