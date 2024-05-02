import './Contact.css'
import React from 'react'
import { startWhatsApp } from '@glass/utils/whats-app/whats-app.util'

export const Contact: React.FC = () => {
  const workshops = [
    {
      name: 'Head Office',
      address: '85 Great Portland Street London, W1W 7LT',
      phone: '+44 7400 400469',
      email: 'hello@fix.glass',
    },
  ]

  return (
    <div className='contact-page'>
      <div className='padding-32'></div>

      <div className='page-header'>
        <div className='breadcrumb'>HOW can we help you?</div>
        <div className='title'>Contact us</div>
        <div className='description'>
          We&apos;re here to help and answer any questions you have. We&apos;re excited to hear from you and assist you
          in any way we can!
        </div>
        <div className='our-office'>
          Our office is registered in London <br />
          but we offer service in different parts of UK.
        </div>
      </div>

      <div>
        {workshops.map((workshop, index) => (
          <div key={index} className='workshop-wrap'>
            <div className='list-item'>
              <img src={process.env.PUBLIC_URL + '/images/map-marker.svg'} className='img-fluid' alt='' />
              <div>85 Great Portland Street, London, W1W 7LT</div>
            </div>
            <div className='list-item'>
              <img src={process.env.PUBLIC_URL + '/images/phone.svg'} className='img-fluid' alt='' />
              <div onClick={() => startWhatsApp(workshop.phone)} className='blue-link'>
                {workshop.phone}
              </div>
            </div>
            <div className='list-item'>
              <img src={process.env.PUBLIC_URL + '/images/email.svg'} className='img-fluid' alt='' />
              <a href={'mailto:' + workshop.email} target='_blank' rel='noreferrer' className='blue-link'>
                {workshop.email}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className='padding-64'></div>
      <div className='padding-64'></div>
      <div className='padding-64'></div>
    </div>
  )
}
