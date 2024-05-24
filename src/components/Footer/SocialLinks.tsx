import './SocialLinks.css'
import React from 'react'

export const SocialLinks: React.FC = () => {
  return (
    <div>
      <div className='d-flex gap-3 gap-md-4'>
        <a
          href='https://www.facebook.com/profile.php?id=100065230862925'
          target='_blank'
          rel='noreferrer'
          className='social-link'
        >
          <img src={process.env.PUBLIC_URL + '/images/facebook.svg'} className='img-fluid' alt='' />
        </a>
        <a href='https://www.instagram.com/fixglassinsta/' target='_blank' rel='noreferrer' className='social-link'>
          <img src={process.env.PUBLIC_URL + '/images/instagram.svg'} className='img-fluid' alt='' />
        </a>
        <a href='https://www.youtube.com/@fixglass_' target='_blank' rel='noreferrer' className='social-link'>
          <img src={process.env.PUBLIC_URL + '/images/youtube.svg'} className='img-fluid' alt='' />
        </a>
        <a href='https://twitter.com/fix_glass_' target='_blank' rel='noreferrer' className='social-link'>
          <img src={process.env.PUBLIC_URL + '/images/twitter.svg'} className='img-fluid' alt='' />
        </a>
        <a href='https://www.linkedin.com' target='_blank' rel='noreferrer' className='social-link'>
          <img src={process.env.PUBLIC_URL + '/images/linkedin.svg'} className='img-fluid' alt='' />
        </a>
        <a href='https://www.tiktok.com/@fix.glass?lang=en' target='_blank' rel='noreferrer' className='social-link'>
          <img src={process.env.PUBLIC_URL + '/images/tiktok.svg'} className='img-fluid' alt='' />
        </a>
      </div>
    </div>
  )
}
