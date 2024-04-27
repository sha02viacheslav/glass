import './Home.css'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PlantTree } from '@glass/components/PlantTree'
import { BeforeAfterType } from '@glass/enums'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import { InstallmentBenefits } from './InstallmentBenefits'
import { LifeTime } from './LifeTime'
import { LiveService } from './LiveService'
import { Partners } from './Partners'
import { PaymentOptions } from './PaymentOptions'
import { Testimonials } from './Testimonials'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [licenseSearchVal, setLicense] = useState('')

  const handleVehInputChange = (data: string | undefined) => {
    setLicense(formatLicenseNumber(data))
  }

  const directToCustomer = () => {
    navigate('/customer/' + licenseSearchVal)
    setLicense('')
  }

  const scrollDown = () => {
    console.warn(window.innerHeight)
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    localStorage.setItem('development version', JSON.stringify('1.1.7'))
  }, [])

  return (
    <div className='home'>
      <section className='sec-banner'>
        <div className='px-3 mt-auto'>
          <div>
            <div>
              <div className='d-flex align-items-center'>
                <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/star.svg'} className='img-fluid' alt='' />
                <div className='lh-15 text-white ms-1'>5.0</div>
                <img src={process.env.PUBLIC_URL + '/images/google.png'} className='img-fluid ms-1' alt='' />
                <div className='lh-15 text-white ms-2'>reviews</div>
              </div>
            </div>
            <h2 className='fnt-30 fnt-md-60 fw-n lh-12 text-white mt-3'>
              New OEM and OEE glass replacement with crash tested glue
            </h2>
            <div className='lh-16 text-gray-400 text-uppercase mt-25'>Done where you are</div>
          </div>

          <div className='d-flex flex-column align-items-center mt-5'>
            <LicensePlate
              placeholderVal={'ENTER REG.'}
              licenseNumber={licenseSearchVal}
              showEdit={false}
              handleVehInputChange={handleVehInputChange}
            />
            <button onClick={directToCustomer} className='btn-raised fnt-18 col-12 col-md-auto py-3 mt-25'>
              Get a Quote
            </button>
            <div className='d-flex gap-3 mt-2'>
              <img src={process.env.PUBLIC_URL + '/images/master-card.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/visa.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/discover.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/amex.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/union-pay.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/jcb.svg'} className='img-fluid' alt='' />
            </div>
            <div className='d-flex justify-content-center mt-35'>
              <img
                src={process.env.PUBLIC_URL + '/images/scroll-down.svg'}
                className='img-fluid cursor-pointer'
                alt=''
                onClick={scrollDown}
              />
            </div>
          </div>
        </div>
      </section>

      <section className='sec-description'>
        <div className='title'>All Brands From Mini Cooper to Range Rover, we got you covered</div>
        <div className='description mt-3'>
          We offer glass replacement for passenger vehicles and vans.
          <br />
          All jobs are done by professionals at your home, workplace or at our workshop, wherever you please.
        </div>
      </section>

      <section className='sec-work'>
        <div className='title'>How we work</div>
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
                <img src={process.env.PUBLIC_URL + '/images/master-card.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/visa.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/discover.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/amex.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/union-pay.svg'} className='img-fluid' alt='' />
                <img src={process.env.PUBLIC_URL + '/images/jcb.svg'} className='img-fluid' alt='' />
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

      <OurMethod beforeAfterType={BeforeAfterType.ALL} />

      <PaymentOptions />

      <div className='padding-64'></div>

      <InstallmentBenefits />

      <div className='padding-64'></div>

      <LifeTime />

      <div className='padding-64'></div>

      <Partners />

      <div className='padding-64'></div>

      <LiveService />

      <div className='padding-64'></div>

      <Testimonials />

      <div className='padding-64'></div>

      <PlantTree />

      <Chat />
    </div>
  )
}
