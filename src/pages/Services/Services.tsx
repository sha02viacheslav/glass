import './Services.css'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PlantTree } from '@glass/components/PlantTree'
import { SERVICES } from '@glass/constants'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export const Services: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const serviceKey = queryParams.get('serviceKey')
  const service = SERVICES.find((item) => item.key === serviceKey) || SERVICES[0]
  const [licenseSearchVal, setLicense] = useState('')

  const tintList = [
    {
      key: 'tint-very-dark',
      title: 'Very Dark',
      desp: 'Blocks 55% of the solar energy Blocks 99% of the UV rays Recommended to reduce glare and fading of the interior',
      img: 'tint-very-dark.png',
    },
    {
      key: 'tint-medium-dark',
      title: 'Medium Dark',
      desp: 'Blocks 55% of the solar energy Blocks 99% of the UV rays Recommended to reduce glare and fading of the interior',
      img: 'tint-medium-dark.png',
    },
    {
      key: 'tint-average',
      title: 'Average',
      desp: 'Blocks 55% of the solar energy Blocks 99% of the UV rays Recommended to reduce glare and fading of the interior',
      img: 'tint-average.png',
    },
    {
      key: 'tint-clear',
      title: 'Clear',
      desp: 'Blocks 55% of the solar energy Blocks 99% of the UV rays Recommended to reduce glare and fading of the interior',
      img: 'tint-clear.png',
    },
  ]

  const handleVehInputChange = (data: string | undefined) => {
    setLicense(formatLicenseNumber(data))
  }

  const directToCustomer = () => {
    navigate('/customer/' + licenseSearchVal)
    setLicense('')
  }

  return (
    <div className='services-page'>
      <section className='sec-banner'>
        <div className='container'>
          <h2 className='fnt-48 fnt-md-60 fw-n text-white px-5'>{service?.title}</h2>
        </div>
      </section>

      <div className='d-flex flex-column flex-md-column-reverse'>
        <section className='sec-description'>
          <div className='container'>
            <p className='text-primary fnt-20 fnt-md-32 px-md-5'>{service?.desp}</p>
          </div>
        </section>

        <section className='sec-quote'>
          <div className='d-flex flex-column align-items-center p-3'>
            <div>
              <label className='text-grey fnt-14 mb-2 ms-5'>Insert your Vehicle Registration Number</label>
              <div className='d-flex flex-column flex-md-row align-items-center gap-4'>
                <LicensePlate
                  placeholderVal={'ENTER REG'}
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

      <section className='sec-tint'>
        <div className='container'>
          <div className='row justify-content-center text-center gy-md-5 gy-4' autoFocus>
            {tintList.map((tintItem, index) => (
              <div key={index} className='col-md-3 col-sm-6'>
                <div className='content p-0'>
                  <div className='h-100 d-flex flex-column'>
                    <img src={process.env.PUBLIC_URL + '/images/' + tintItem.img} className='img-fluid' alt='' />
                    <div className='bg-grey flex-fill content-sv text-left'>
                      <div className={'text-primary px-4 py-3 ' + tintItem.key}>{tintItem.title}</div>
                      <p className='text-grey p-4'>{tintItem.desp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OurMethod beforeAfterType={service.beforeAfterType} showTitle={false} />

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

      <Chat />

      {/*Remove for now, will check later*/}
      {/*<CaseStudies />*/}
    </div>
  )
}
