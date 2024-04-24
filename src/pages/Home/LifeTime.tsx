import './LifeTime.css'
import React from 'react'

export const LifeTime: React.FC = () => {
  return (
    <section className='sec-life-time'>
      <div className='sec-header'>
        <div className='title'>Life time guarantee</div>
        <div className='description'>Lifetime Peace of Mind for Your Car&apos;s Glass Repair</div>
      </div>
      <div className='sec-content'>
        <div className='sec-content-item'>
          <img src={process.env.PUBLIC_URL + '/images/life-time1.svg'} className='img-fluid' alt='' />
          <div>No water leaks in the repaired area</div>
        </div>
        <div className='sec-content-item'>
          <img src={process.env.PUBLIC_URL + '/images/life-time2.svg'} className='img-fluid' alt='' />
          <div>No damage to interior plastic, trim, or upholstery as a result of the repair.</div>
        </div>
        <div className='sec-content-item'>
          <img src={process.env.PUBLIC_URL + '/images/life-time3.svg'} className='img-fluid' alt='' />
          <div>No damage to exterior paint or finish caused by the repair work.</div>
        </div>
      </div>
    </section>
  )
}
