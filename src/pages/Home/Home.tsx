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
import { PUBLIC_URL } from '@glass/envs'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [licenseSearchVal, setLicense] = useState('')

  const services = [
    {
      title: 'New Windscreen Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new windscreen will meet all quality standards. All different sensors and heating versions. Whole process 1-2 hours and vehicle is safe to drive.',
    },
    {
      title: 'New Door Glass Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated door glass will meet all quality standards. Rear doors have privacy glasses available. Shattered glass can be vacuumed. Whole process 1-2 hours.',
    },
    {
      title: 'New Heated Rear Windscreen Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated rear windscreen will meet all quality standards. Shattered glass can be vacuumed. Privacy glasses available. Whole process 1-2 hours.',
    },
    {
      title: 'New Windscreen Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new windscreen will meet all quality standards. All different sensors and heating versions. Whole process 1-2 hours and vehicle is safe to drive.',
    },
    {
      title: 'New Door Glass Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated door glass will meet all quality standards. Rear doors have privacy glasses available. Shattered glass can be vacuumed. Whole process 1-2 hours.',
    },
    {
      title: 'New Heated Rear Windscreen Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated rear windscreen will meet all quality standards. Shattered glass can be vacuumed. Privacy glasses available. Whole process 1-2 hours.',
    },
  ]

  const handleVehInputChange = (data: string | undefined) => {
    setLicense(formatLicenseNumber(data))
  }

  const directToCustomer = () => {
    if (licenseSearchVal) {
      navigate('/customer/' + licenseSearchVal)
      setLicense('')
    }
  }

  useEffect(() => {
    localStorage.setItem('development version', JSON.stringify('1.1.7'))
  }, [])

  return (
    <div className='home'>
      <section className='sec-banner'>
        <div className='container'>
          <h2 className='fnt-48 fnt-md-60 fw-n text-white px-5'>
            We <img src={PUBLIC_URL + '/images/heart.png'} className='img-fluid heart' alt='' /> to replace glasses.
            <br />
            At your home or work!
          </h2>
        </div>
      </section>

      <div className='d-flex flex-column flex-md-column-reverse'>
        <section className='sec-quote'>
          <div className='d-flex flex-column align-items-center p-3'>
            <div>
              <label className='text-grey fnt-14 mb-2 ms-5'>Insert your Vehicle Registration Number</label>
              <div className='d-flex flex-column flex-md-row align-items-center gap-4'>
                <LicensePlate
                  placeholderVal={'NU71 REG'}
                  licenseNumber={licenseSearchVal}
                  showEdit={false}
                  handleVehInputChange={handleVehInputChange}
                />
                <button onClick={directToCustomer} className='btn-raised round col-12 col-md-auto'>
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className='sec-description'>
          <div className='container'>
            <p className='text-primary fnt-20 fnt-md-32 px-md-5'>
              Wherever you are, whichever model you drive, we got you covered. We offer windscreen repairs and
              replacements for passenger vehicles and vans. All jobs are done by professionals at your home or work.
            </p>
          </div>
        </section>
      </div>

      <OurMethod />

      <section className='sec-services'>
        <div className='container'>
          <h1 className='fnt-48 fnt-md-60 fw-n text-dark px-md-4 mb-4 mb-md-5'>Services</h1>
          <div className='row'>
            {services.map((service, index) => (
              <div key={index} className='col-md-4 col-sm-6 mb-3 mb-md-5 pb-md-4'>
                <div className='d-flex flex-column bg-white h-100 p-4'>
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
          <div className='col-md-4 offset-md-8 py-4 py-md-5'>
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
        </div>
      </section>

      <section className='sec-review'>
        <div className='container p-0'>
          <div className='px-4 px-md-5'>
            <h2 className='fnt-48 fnt-md-60 fw-n text-white mb-4 mb-md-5'>Testimonials</h2>
          </div>
          <GoogleReviews />
        </div>
      </section>

      <PlantTree />

      <Chat />
    </div>
  )
}
