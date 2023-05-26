import './Services.css'
import React from 'react'
import { GetQuoteOrCall } from '@glass/components/GetQuoteOrCall'

export const Services: React.FC = () => {
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
  return (
    <div>
      <section className='sec-banner-s'>
        <div className='container'>
          <h1 className='main-heading text-white'>Our Services </h1>
          <p className='content-s text-white'>We love to replace glasses. At your home or work.</p>
        </div>
      </section>
      <section className='sec-car-slider section'>
        <div className='container'>
          <div className='row justify-content-center text-center gy-md-5 gy-4' autoFocus>
            {services.map((service, index) => (
              <div key={index} className='col-md-4 col-sm-6'>
                <div className='content p-0'>
                  <div className='content-overlay'></div>
                  <div>
                    <img src={process.env.PUBLIC_URL + '/img/' + service.img} className='img-fluid' alt='' />
                    <div className='content-sv text-left p-4'>
                      <h5 className='text-blue mb-3 pt-2'>{service.title}</h5>
                      <p>{service.desp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='get-quote-wrap'>
        <GetQuoteOrCall />
      </div>

      {/*Remove for now, will check later*/}
      {/*<CaseStudies />*/}
    </div>
  )
}
