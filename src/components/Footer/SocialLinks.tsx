import './style.css'
import React from 'react'

export const SocialLinks: React.FC = () => {
  return (
    <div className='d-flex gap-3 gap-md-4'>
      <a href='https://twitter.com/fix_glass_' target='_blank' rel='noreferrer' className='social-link'>
        <i className='fa-brands fa-x-twitter'></i>
      </a>
      <a
        href='https://www.facebook.com/profile.php?id=100065230862925'
        target='_blank'
        rel='noreferrer'
        className='social-link'
      >
        <i className='fa-brands fa-facebook-f'></i>
      </a>
      <a href='https://www.instagram.com/fixglassinsta/' target='_blank' rel='noreferrer' className='social-link'>
        <i className='fa-brands fa-instagram'></i>
      </a>
      <a href='https://www.youtube.com/@fixglass_' target='_blank' rel='noreferrer' className='social-link'>
        <i className='fa-brands fa-youtube'></i>
      </a>
      <a href='https://www.tiktok.com/@fix.glass?lang=en' target='_blank' rel='noreferrer' className='social-link'>
        <i className='fa-brands fa-tiktok'></i>
      </a>
    </div>
  )
}
