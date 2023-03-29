import React from 'react'
import { PUBLIC_URL } from '@glass/envs'

export const BeforeAfter: React.FC = () => {
  return (
    <div className='item'>
      <div className='row g-0'>
        <div className='col-6'>
          <div className='item-img odd animated wow fadeIn'>
            <img src={PUBLIC_URL + '/img/gallery/before1.jpg'} className='img-fluid' alt='' />
            <div className='ribbon'>
              <span>BEFORE</span>
            </div>
            <div className='overlay odd fade-overlay'>
              <div className='text'>
                <i className='fa fa-search'></i>
              </div>
            </div>
          </div>
        </div>
        <div className='col-6'>
          <div className='item-img even animated wow fadeIn'>
            <img src={PUBLIC_URL + '/img/gallery/after1.jpg'} className='img-fluid' alt='' />
            <div className='ribbon ribbon-cyan'>
              <span>AFTER</span>
            </div>
            <div className='overlay even fade-overlay'>
              <div className='text'>
                <i className='fa fa-search'></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
