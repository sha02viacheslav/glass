import './AboutUs.css'
import React from 'react'
import { PlantTree } from '@glass/components/PlantTree'

export const AboutUs: React.FC = () => {
  return (
    <div className='about-us'>
      <section className='sec-title'>
        <div className='container'>
          <h1 className='fnt-48 fnt-md-60 fw-n text-primary px-md-5'>About Us</h1>
        </div>
      </section>

      <section className='sec-banner'>
        <div className='container'>
          <h2 className='fnt-48 fnt-md-60 fw-n text-white px-5'>
            Clearing the Way for <br />
            Safer Tomorrows.
          </h2>
        </div>
      </section>

      <section className='sec-description'>
        <div className='container'>
          <p className='text-primary fnt-20 fnt-md-32 px-md-5'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </div>
      </section>

      <PlantTree />
    </div>
  )
}
