import './Home.css'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { PaymentCards } from '@glass/components/PaymentCards'
import { PlantTree } from '@glass/components/PlantTree'
import { ReviewsDialog } from '@glass/components/ReviewsDialog'
import { BeforeAfterType } from '@glass/enums'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import { HomeDescription } from './HomeDescription'
import { HowWeWork } from './HowWeWork'
import { InstallmentBenefits } from './InstallmentBenefits'
import { LifeTime } from './LifeTime'
import { LiveService } from './LiveService'
import { PaymentOptions } from './PaymentOptions'
import { Testimonials } from './Testimonials'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [licenseSearchVal, setLicense] = useState('')
  const [animationStep, setAnimationStep] = useState<number>(0)

  const handleVehInputChange = (data: string | undefined) => {
    setLicense(formatLicenseNumber(data))
  }

  const directToCustomer = () => {
    navigate('/inquiry-intro/' + licenseSearchVal)
    setLicense('')
  }

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    localStorage.setItem('development version', JSON.stringify('1.1.7'))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3)
    }, 9000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='home'>
      <section className='sec-banner'>
        {animationStep === 0 && <div className='sec-background1'></div>}
        {animationStep === 1 && <div className='sec-background2'></div>}
        {animationStep === 2 && <div className='sec-background3'></div>}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'flex-end' },
            height: '100%',
            pb: { xs: 0, lg: 6 },
          }}
          className='container'
        >
          <Box sx={{ mx: 'auto', maxWidth: 785 }}>
            <Box
              sx={{ display: 'flex', justifyContent: { xs: 'flex-start', lg: 'center' } }}
              className={animationStep === 2 ? 'review-animation' : ''}
            >
              <ReviewsDialog />
            </Box>

            <Box className={animationStep === 2 ? ' content-animation' : ''}>
              <Typography
                variant='h2'
                sx={{
                  color: '#fff',
                  textAlign: { xs: 'left', lg: 'center' },
                  fontSize: { xs: 30, lg: 60 },
                  fontWeight: '700',
                  lineHeight: '120%',
                  mt: { xs: 4, lg: 6 },
                }}
              >
                New OEM and OEE glass replacement with crash tested glue
              </Typography>
              <Typography
                variant='h2'
                sx={{
                  color: 'var(--Gray-300, #D8D8DA)',
                  textAlign: { xs: 'left', lg: 'center' },
                  fontSize: { xs: 16, lg: 20 },
                  lineHeight: '160%',
                  textTransform: 'uppercase',
                  mt: { xs: 3, lg: 4 },
                }}
              >
                Done where you are
              </Typography>

              <Box sx={{ maxWidth: 400, mx: 'auto' }} className='d-flex flex-column align-items-center mt-5'>
                <LicensePlate
                  placeholderVal={'ENTER REG.'}
                  licenseNumber={licenseSearchVal}
                  showSearch={false}
                  handleVehInputChange={handleVehInputChange}
                />
                <button onClick={directToCustomer} className='btn-raised w-100 mt-25'>
                  Get a Quote
                </button>
                <div className='d-flex gap-3 mt-2'>
                  <PaymentCards />
                </div>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mt: { xs: 5, lg: 16 } }} className='d-flex justify-content-center mt-35'>
            <img
              src={process.env.PUBLIC_URL + '/images/scroll-down.svg'}
              className='img-fluid cursor-pointer'
              alt=''
              onClick={scrollDown}
            />
          </Box>
        </Box>
      </section>

      <Box sx={{ py: { xs: 6, lg: 8 } }}></Box>

      <HomeDescription />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <HowWeWork />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <PaymentOptions />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <InstallmentBenefits />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <LifeTime />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Partners />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Box className='container'>
        <LiveService />
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Testimonials />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <PlantTree />

      <Box sx={{ py: 25 }}></Box>

      <Chat />
    </div>
  )
}
