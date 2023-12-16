import './contact.css'
import React, { useState } from 'react'
import { PlantTree } from '@glass/components/PlantTree'
import { startWhatsApp } from '@glass/utils/whats-app/whats-app.util'

export const Contact: React.FC = () => {
  const workshops = [
    { name: 'Workshop FixGlass Sheffield', address: '1 Petre Drive Sheffield, S4 7PZ', phone: '+44 7400 400469' },
    { name: 'Head Office', address: '85 Great Portland Street London, W1W 7LT', email: 'hello@fix.glass' },
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
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2378.6136493864597!2d-1.443208026105967!3d53.403850748273264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761fe515112275%3A0x1b7941c93ae64913!2sFixGlass%20Sheffield!5e0!3m2!1sen!2sus!4v1702396416384!5m2!1sen!2sus'
            width='100%'
            height='100%'
            style={{ border: 0 }}
            allowFullScreen
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </section>

      <section className='sec-workshop bg-grey bg-md-white'>
        <div className='container'>
          <div className='row'>
            {workshops.map((workshop, index) => (
              <div key={index} className='col-md-4'>
                <div className='p-4 bg-white mb-3 mb-md-0'>
                  <div className='fnt-20 fnt-md-28 text-primary'>{workshop.name}</div>
                  <div className='fnt-14 fnt-md-16 text-grey mt-3'>{workshop.address}</div>
                  {!!workshop.phone && (
                    <>
                      <div className='fnt-14 fnt-md-16 text-grey mt-3'>
                        Business mobile: <span className='text-primary'>{workshop.phone}</span>
                      </div>
                      <button
                        className='btn-raised round green mt-3 whats-app-chat'
                        onClick={() => startWhatsApp(workshop.phone)}
                      >
                        <div className='d-flex align-items-center'>
                          <i className='fa-brands fa-whatsapp fnt-24 me-2'></i> WhatsApp
                        </div>
                      </button>
                    </>
                  )}
                  {!!workshop.email && (
                    <div className='fnt-14 fnt-md-16 text-grey mt-3'>
                      Email: <span className='text-primary'>{workshop.email}</span>
                    </div>
                  )}
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
