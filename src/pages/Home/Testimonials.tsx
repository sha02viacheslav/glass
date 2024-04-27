import './Testimonials.css'
import React from 'react'
import { GoogleReviews } from '@glass/components/Footer/GoogleReviews'

export const Testimonials: React.FC = () => {
  return (
    <section className='sec-review'>
      <div className='sec-header'>
        <div className='title'>Testimonials from our customers</div>
        <div className='description'>
          We have over <span className='bold'>1000+</span> satisfied customers. See what they have to say about us.
        </div>
      </div>
      <div className='sec-content'>
        <GoogleReviews />
      </div>
    </section>
  )
}
