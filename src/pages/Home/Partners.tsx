import './Partners.css'
import React from 'react'

export const Partners: React.FC = () => {
  return (
    <section className='sec-partners'>
      <div className='title'>
        We collaborate with <span className='bold'>industry-leading partners.</span>
      </div>
      <div className='description'>Best Glue makers in the world</div>
      <div className='d-flex align-items-center justify-content-center gap-4'>
        <img src={process.env.PUBLIC_URL + '/images/partner1.png'} className='img-fluid' alt='' />
        <img src={process.env.PUBLIC_URL + '/images/partner2.png'} className='img-fluid' alt='' />
      </div>
      <div className='premier-partners'>Premier Partners: Leaders in Glass & Product Manufacturing</div>
      <div className='premier-partners-wrap'>
        <img src={process.env.PUBLIC_URL + '/images/premier-partner1.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner2.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner3.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner4.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner5.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner6.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner7.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner8.png'} alt='' />
        <img src={process.env.PUBLIC_URL + '/images/premier-partner9.png'} alt='' />
      </div>
    </section>
  )
}
