import './Services.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SERVICES } from '@glass/constants'

export const Services: React.FC = () => {
  const navigate = useNavigate()

  const goToServicePage = (key: string) => {
    navigate(`/services?serviceKey=${key}`)
  }

  return (
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
  )
}
