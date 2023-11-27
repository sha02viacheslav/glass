import './contact.css'
import React, { useState } from 'react'
import { PlantTree } from '@glass/components/PlantTree'

export const Contact: React.FC = () => {
  const workshops = [
    { name: 'Headquarter', address: '85 Great Portland Street London, W1W 7LT', phone: '07400 400469' },
    { name: 'Headquarter', address: '85 Great Portland Street London, W1W 7LT', phone: '07400 400469' },
    { name: 'Headquarter', address: '85 Great Portland Street London, W1W 7LT', phone: '07400 400469' },
    { name: 'Headquarter', address: '85 Great Portland Street London, W1W 7LT', phone: '07400 400469' },
  ]

  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleSubmitClick = () => {
    console.warn(email, message)
  }

  return (
    <div className='contact-page'>
      <section className='sec-title bg-grey'>
        <div className='container'>
          <h1 className='fnt-48 fnt-md-60 fw-n text-primary px-md-5'>Contact Us</h1>
        </div>
      </section>

      <section className='map'>
        <div className='map-container'>
          <iframe
            src='https://maps.google.com/maps?q=manhatan&t=&z=13&ie=UTF8&iwloc=&output=embed'
            width='100%'
            height='100%'
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className='sec-workshop bg-grey bg-md-white'>
        <div className='container'>
          <div className='row'>
            {workshops.map((workshop, index) => (
              <div key={index} className='col-md-3'>
                <div className='p-4 bg-white mb-3 mb-md-0'>
                  <div className='fnt-20 fnt-md-28 text-primary'>{workshop.name}</div>
                  <div className='fnt-14 fnt-md-16 text-grey mt-3'>{workshop.address}</div>
                  <div className='fnt-14 fnt-md-16 text-grey mt-3'>
                    Call <span className='text-primary'>{workshop.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='sec-contact-form'>
        <div className='h-100 d-flex align-items-center px-4 px-md-5'>
          <div className='col-md-4 offset-md-3'>
            <h2 className='fnt-48 fnt-md-60 fw-n text-white mb-2 mb-md-3'>Contact Us</h2>
            <div className='fnt-16 fnt-md-18 fw-n text-white'>
              Need to get in touch with us? Fill out the form with your request. We will reply as soon as possible.
            </div>
            <div className='row mt-4'>
              <div className='col-12'>
                <div className='form-group mb-4'>
                  <label>Email</label>
                  <input
                    type='text'
                    className='form-control'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-12'>
                <div className='form-group mb-4'>
                  <label>Message</label>
                  <textarea
                    rows={4}
                    className='form-control h-auto'
                    placeholder='Message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-12'>
                <button className='btn-raised round' onClick={handleSubmitClick}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PlantTree />
    </div>
  )
}
