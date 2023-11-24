import './Services.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PlantTree } from '@glass/components/PlantTree'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export const Services: React.FC = () => {
  const navigate = useNavigate()
  const [licenseSearchVal, setLicense] = useState('')

  const services = [
    {
      title: 'New Windscreen Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new windscreen will meet all quality standards. All different sensors and heating versions. Whole process 1-2 hours and vehicle is safe to drive.',
      img: 'service1.png',
    },
    {
      title: 'New Door Glass Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated door glass will meet all quality standards. Rear doors have privacy glasses available. Shattered glass can be vacuumed. Whole process 1-2 hours.',
      img: 'service2.png',
    },
    {
      title: 'New Heated Rear Windscreen Replacement',
      desp: 'We can source the new glass from the biggest suppliers and new, either tempered or laminated rear windscreen will meet all quality standards. Shattered glass can be vacuumed. Privacy glasses available. Whole process 1-2 hours.',
      img: 'service3.png',
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

  return (
    <div className='services-page'>
      <section className='sec-banner'>
        <div className='container'>
          <h2 className='fnt-48 fnt-md-60 fw-n text-white px-5'>
            Drive Clear, Drive Cool:
            <br />
            Tinted Perfection.
          </h2>
        </div>
      </section>

      <div className='d-flex flex-column flex-md-column-reverse'>
        <section className='sec-description'>
          <div className='container'>
            <p className='text-primary fnt-20 fnt-md-32 px-md-5'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </section>

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
      </div>

      <section className='sec-services'>
        <div className='container'>
          <div className='row justify-content-center text-center gy-md-5 gy-4' autoFocus>
            {services.map((service, index) => (
              <div key={index} className='col-md-4 col-sm-6'>
                <div className='content p-0'>
                  <div className='h-100 d-flex flex-column'>
                    <img src={process.env.PUBLIC_URL + '/img/' + service.img} className='img-fluid' alt='' />
                    <div className='bg-grey flex-fill content-sv text-left '>
                      <div className='bg-dark text-primary px-4 py-3'>{service.title}</div>
                      <p className='text-grey p-4'>{service.desp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OurMethod showTitle={false} />

      <section className='sec-install-film'>
        <div className='container p-0'>
          <div className='row px-4 px-md-5'>
            <div className='col-md-7 offset-md-5'>
              <h2 className='fnt-48 fnt-md-60 fw-n text-primary mb-4 mb-md-5'>
                Why Should You Install a Window Film On Your Car?
              </h2>
              <div className='fnt-16 fnt-md-18 fw-n text-white'>
                Aesthetic improvement and increased security
                <br />
                <br />
                To improve the aesthetic appearance of your car, there is a variety of films suitable for any
                requirement, from transparent ones to coloured ones to different shaded ones. Also, it is more difficult
                to break through the glass to steal the vehicle.
                <br />
                <br />
                The installation of the film will ensure for many years a comfortable and safe riding. Suppose the film
                presents adhesive defects, bubbles, cracks, scratches, laminations, peeling or any manufacturing defect
                when the assembly act occurs, provided that the vehicle hasn&apos;t changed ownership. In that case, we
                reserve the duty to replace the defective material through authorized installers.
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlantTree />

      {/*Remove for now, will check later*/}
      {/*<CaseStudies />*/}
    </div>
  )
}
