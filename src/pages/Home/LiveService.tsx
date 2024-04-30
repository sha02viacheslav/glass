import './LiveService.css'
import React from 'react'

export type LiveServiceProps = {
  image?: string
}

export const LiveService: React.FC<LiveServiceProps> = ({ image = 'live-service-bg.png' }) => {
  return (
    <section className='sec-live-service'>
      <img src={process.env.PUBLIC_URL + '/images/' + image} className='sec-image' alt='' />
      <div className='sec-content'>
        <div className='title'>Live Service Tracking</div>
        <div className='description'>
          You are able to track our specialist live as they come to you. Know exactly when they&apos;ll arrive, like
          Uber.
        </div>
      </div>
    </section>
  )
}
