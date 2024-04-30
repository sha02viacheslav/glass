import './AboutUs.css'
import React from 'react'
import { Chat } from '@glass/components/Chat'
import { Partners } from '@glass/components/Partners/Partners'
import { PlantTree } from '@glass/components/PlantTree'

export const AboutUs: React.FC = () => {
  return (
    <div className='about-us'>
      <div className='padding-32'></div>

      <div className='about-us-card'>
        <div className='category'>About us</div>
        <div className='title'>Get to Know Us: Car Glass Experts at Your Service</div>
        <div className='description'>
          We&apos;re dedicated professionals committed to top-quality glass repairs, prioritizing safety and
          reliability.
        </div>
        <div className='card-image-wrap show-logo'>
          <img src={process.env.PUBLIC_URL + '/images/about-us.png'} alt='' />
        </div>
      </div>

      <div className='padding-32'></div>

      <div className='about-us-card'>
        <div className='category'>Our mission</div>
        <div className='title'>Keeping Your Vehicle Safe and Clear</div>
        <div className='description'>
          Our mission is to deliver convenient, quick and top-quality glass repair by professionals.
        </div>
        <div className='card-image-wrap'>
          <img src={process.env.PUBLIC_URL + '/images/our-mission.png'} alt='' />
        </div>
      </div>

      <div className='padding-64'></div>

      <div className='our-vision-card'>
        <div className='category'>Our Vision</div>
        <div className='title'>
          Our vision is to offer seamless and reliable mobile car glass repair, giving our customers confidence and
          peace of mind.
        </div>
      </div>

      <div className='padding-64'></div>

      <div className='about-us-card'>
        <div className='category'>Our service in numbers</div>
        <div className='title'>FixGlass: Empowering Car Glass Repair in Numbers</div>
        <div className='description'>
          Experience seamless glass repairs with FixGlass, your trusted destination for restoring your car&apos;s
          windshield and windows.
        </div>
        <div className='services-container'>
          <div className='service-wrap'>
            <div className='service-title'>1000+ customers</div>
            <div className='service-description'>
              Benefit from the expertise of 1000+ satisfied customers who rely on us for top-notch car glass repair
              services at FixGlass.
            </div>
          </div>
          <div className='service-wrap'>
            <div className='service-title'>98% Satisfaction rate</div>
            <div className='service-description'>
              Benefit from the expertise of 1000+ satisfied customers who rely on us for top-notch car glass repair
              services at FixGlass.-
            </div>
          </div>
          <div className='service-wrap'>
            <div className='service-title'>2000+ glass repairs</div>
            <div className='service-description'>
              Choose FixGlass for your car&apos;s glass needs, where we&apos;ve completed over 2000+ successful repairs,
              ensuring quality and reliability every time
            </div>
          </div>
        </div>
      </div>

      <div className='padding-64'></div>

      <div className='our-story-card'>
        <div className='card-header'>
          <div className='category'>Our story</div>
          <div className='title'>FixGlass&apos; Story. From the Words of Our Founder</div>
        </div>
        <div className='card-content'>
          <div className='title'>Hi, I&apos;m Arvin.</div>
          <div className='description'>
            If you have few minutes a would love to share a story of how FixGlass was founded and my journey to
            providing top-notch mobile glass repairs.
          </div>
        </div>
        <button>
          <span>Read the full story</span>
          <img src={process.env.PUBLIC_URL + '/images/arrow-right-blue.svg'} className='img-fluid' alt='' />
        </button>
      </div>

      <div className='padding-64'></div>

      <Partners />

      <div className='padding-64'></div>

      <PlantTree />

      <div className='padding-64'></div>
      <div className='padding-64'></div>

      <Chat />
    </div>
  )
}
