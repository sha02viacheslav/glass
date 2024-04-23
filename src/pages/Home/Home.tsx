import './Home.css'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { GoogleReviews } from '@glass/components/Footer/GoogleReviews'
import { GetQuoteOrCall } from '@glass/components/GetQuoteOrCall'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PlantTree } from '@glass/components/PlantTree'
import { SERVICES } from '@glass/constants'
import { BeforeAfterType } from '@glass/enums'
import { PUBLIC_URL } from '@glass/envs'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

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

  const goToServicePage = (key: string) => {
    navigate(`/services?serviceKey=${key}`)
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

      <OurMethod beforeAfterType={BeforeAfterType.ALL} />

      <section className='sec-services'>
        <div className='container'>
          <h1 className='fnt-48 fnt-md-60 fw-n text-dark px-md-4 mb-4 mb-md-5'>Services</h1>
          <div className='row'>
            {SERVICES.map((service, index) => (
              <div key={index} className='col-md-4 col-sm-6 mb-3 mb-md-5 pb-md-4'>
                <div
                  className='d-flex flex-column bg-white h-100 p-4 cursor-pointer'
                  onClick={() => goToServicePage(service.key)}
                >
                  <div className='fnt-20 fnt-md-28 text-primary mb-3'>{service.title}</div>
                  <p className='fnt-14 fnt-md-16 text-grey flex-fill mb-3'>{service.desp}</p>
                  <div className='d-flex justify-content-end'>
                    <div className='fnt-18 fnt-md-20 text-dark discover-more'>Discover more</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='sec-selling'>
        <div className='container'>
          <div className='col-xl-4 offset-xl-7 offset-xxl-8 py-4 py-md-5'>
            <p className='fnt-48 fnt-md-60 text-dark ps-md-4 mb-4'>Our Unique Selling Points</p>
            <ul className='selling-points p-0'>
              <li className='fnt-16 fnt-md-18 mb-3 text-primary'>
                We use brand new Original Equipment Equivalent(OEE) glasses, the same as going through insurance,
                ensuring the highest quality
              </li>
              <li className='fnt-16 fnt-md-18 mb-3 text-primary'>
                We can source glasses for all vehicles on the road from Ford to Lamborghini
              </li>
              <li className='fnt-16 fnt-md-18 mb-3 text-primary'>
                Crash-tested premium windscreen glue with 30 min safe drive away time; he whole replacement time is
                1-2hours
              </li>
              <li className='fnt-16 fnt-md-18 mb-3 text-primary'>
                Replacement is done professionally as it should be done, not causing extra damage to the car and no
                water leaks
              </li>
              <li className='fnt-16 fnt-md-18 text-primary'>Lifetime guarantee as long as you own the car</li>
            </ul>
            <div className='mt-4 mt-md-5'>
              <GetQuoteOrCall showRegInput={false} />
            </div>
          </div>

          <img
            src={PUBLIC_URL + '/images/home-selling-overlay.png'}
            className='img-fluid sec-selling-overlay d-none d-xl-block'
            alt=''
          />
        </div>
      </section>

      <section className='sec-review'>
        <div className='container p-0'>
          <div className='px-4 px-lg-5 mx-lg-5'>
            <h2 className='fnt-48 fnt-md-60 fw-n text-white mb-4 mb-md-5'>Testimonials</h2>
          </div>
          <img
            src={PUBLIC_URL + '/images/review-overlay.png'}
            className='img-fluid sec-review-overlay d-none d-lg-block'
            alt=''
          />
          <GoogleReviews />
        </div>
      </section>

      <PlantTree />

      <Chat />
    </div>
  )
}
