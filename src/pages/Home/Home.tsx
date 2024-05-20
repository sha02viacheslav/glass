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

      <section className='container sec-work'>
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
        <div className='d-flex flex-column gap-2'>
          <div className='work-card'>
            <div className='card-content'>
              <div className='title'>STEP 1</div>
              <div className='description'>
                Fill out the short quote form <a>here</a>
              </div>
            </div>
            <div className='img-wrap'>
              <img src={process.env.PUBLIC_URL + '/images/step1.png'} />
            </div>
          </div>
          <div className='work-card'>
            <div className='card-content'>
              <div className='title'>STEP 2</div>
              <div className='description'>
                We find correct brand new OEM or OEE glass and update your online quote link ASAP, most cases in
                minutes.
              </div>
            </div>
            <div className='img-wrap'>
              <img src={process.env.PUBLIC_URL + '/images/step2.png'} />
            </div>
          </div>
          <div className='work-card'>
            <div className='card-content'>
              <div className='title'>STEP 3</div>
              <div className='description'>
                Pay upfront cost of the monthly instalment plan or full credit card payment, then confirm your booking
                date and location. Everything is done online.
              </div>
            </div>
            <div className='img-wrap'>
              <img src={process.env.PUBLIC_URL + '/images/step3.png'} />
              <div className='payment-options'>
                <PaymentCards />
              </div>
            </div>
          </div>
          <div className='work-card'>
            <div className='card-content'>
              <div className='title'>STEP 4</div>
              <div className='description'>
                You&apos;ll see booking confirmation from your link with Live tracking, our technician will keep you
                updated when job is done and you can drive your car.
              </div>
            </div>
            <div className='img-wrap'>
              <img src={process.env.PUBLIC_URL + '/images/step4.png'} />
            </div>
          </div>
        </div>
      </section>

      <div className='padding-64'></div>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} />

      <div className='padding-64'></div>

      <PaymentOptions />

      <div className='padding-64'></div>

      <InstallmentBenefits />

      <div className='padding-64'></div>

      <LifeTime />

      <div className='padding-64'></div>

      <Partners />

      <div className='padding-64'></div>

      <Box sx={{ margin: '0 16px' }}>
        <LiveService />
      </Box>

      <div className='padding-64'></div>

      <Testimonials />

      <div className='padding-64'></div>

      <PlantTree />

      <div className='padding-64'></div>
      <div className='padding-64'></div>
      <div className='padding-64'></div>

      <Chat />
    </div>
  )
}
