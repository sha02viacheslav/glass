import './Services.css'
import React from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Chat } from '@glass/components/Chat'
import { OurMethod } from '@glass/components/OurMethod'
import { Partners } from '@glass/components/Partners/Partners'
import { PlantTree } from '@glass/components/PlantTree'
import { SERVICES } from '@glass/constants'
import { BeforeAfterType } from '@glass/enums'
import { LifeTime } from '../Home/LifeTime'
import { LiveService } from '../Home/LiveService'
import { Testimonials } from '../Home/Testimonials'

export const Services: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='services-page'>
      <div className='padding-32'></div>

      <div className='page-header'>
        <div className='breadcrumb'>Our services</div>
        <div className='title'>Premium Glass Replacement at Your Place</div>
        <div className='description'>
          We source high-quality glass exceeding all safety standards. All existing sensors and heating elements will be
          included. Safely drive again after 1 - 2 hours.
        </div>
      </div>

      <div className='service-card-container'>
        {SERVICES.map((service, index) => (
          <div key={index} className='service-card' onClick={() => navigate('/service-detail/' + service.key)}>
            <div className='card-header'>
              <img src={process.env.PUBLIC_URL + '/images/' + service.background} className='img-fluid' alt='' />
              <div className='title'>{service.title}</div>
            </div>
            <div className='card-content'>
              <div className='description'>{service.description}</div>
              <div className='card-content-items'>
                <div className='card-content-item'>
                  <img src={process.env.PUBLIC_URL + '/images/car-windshield.svg'} className='img-fluid' alt='' />
                  <div>{service.glass}</div>
                </div>
                <div className='card-content-item'>
                  <img src={process.env.PUBLIC_URL + '/images/quality-high.svg'} className='img-fluid' alt='' />
                  <div>{service.quality}</div>
                </div>
                <div className='card-content-item'>
                  <img src={process.env.PUBLIC_URL + '/images/timer.svg'} className='img-fluid' alt='' />
                  <div>{service.time}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='padding-64'></div>

      <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

      <div className='padding-64'></div>

      <LifeTime />

      <div className='padding-64'></div>

      <Partners />

      <div className='padding-64'></div>

      <Box sx={{ margin: '0 16px' }}>
        <LiveService />
      </Box>

      <div className='padding-64'></div>

      <Testimonials />

      <div className='padding-64'></div>

      <PlantTree />

      <div className='padding-64'></div>
      <div className='padding-64'></div>
      <div className='padding-64'></div>
      <div className='padding-64'></div>
      <div className='padding-64'></div>

      <Chat />

      {/*Remove for now, will check later*/}
      {/*<CaseStudies />*/}
    </div>
  )
}
