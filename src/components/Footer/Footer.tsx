import './Footer.css'
import React from 'react'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { SocialLinks } from '@glass/components/Footer/SocialLinks'

export const Footer: React.FC = () => {
  return (
    <Box sx={{ background: 'var(--Light-Blue---Primary-800, #020e21)' }}>
      <Box className='container'>
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            borderTop: '1px solid var(--Light-Blue---Primary-700, #081f44)',
            width: '100%',
          }}
        ></Box>

        <Box sx={{ pt: { xs: 4, lg: 16 }, pb: 12 }} className='footer-content'>
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: { xs: 'flex-start', lg: 'space-between' },
                gap: { xs: 8, lg: 16 },
                pb: 8,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: { xs: '100%', lg: 'auto' },
                  flexDirection: { xs: 'row', lg: 'column' },
                  justifyContent: { xs: 'space-between', lg: 'flex-start' },
                  alignItems: { xs: 'center', lg: 'flex-start' },
                }}
              >
                <div>
                  <a href='#'>
                    <img src={process.env.PUBLIC_URL + '/images/logo.svg'} className='img-fluid' alt='' />
                  </a>
                </div>
                <SocialLinks />
              </Box>

              <Box
                sx={{
                  display: { lg: 'none' },
                  borderTop: '1px solid var(--Light-Blue---Primary-700, #081f44)',
                  width: '100%',
                }}
              ></Box>

              <Box className='footer-link-wrap'>
                <div className='title'>Our services</div>
                <Link to='/services?serviceKey=new-windscreen-replacement' className='footer-link'>
                  Windscreen replacement
                </Link>
                <Link to='/services?serviceKey=new-door-glass-replacement' className='footer-link'>
                  Door glass replacement
                </Link>
                <Link to='/services?serviceKey=new-heated-rear-windscreen-replacement' className='footer-link'>
                  Rear windscreen replacement
                </Link>
              </Box>

              <Box
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                }}
                className='footer-link-wrap'
              >
                <div className='title'>Repair & Savings Hub</div>
                <Link to='/comparison' className='footer-link'>
                  FixGlass vs Cheap Providers
                </Link>
                <Link to='/process' className='footer-link'>
                  Learn About How We Work!
                </Link>
                <Link to='/installments' className='footer-link'>
                  Saving money with installments
                </Link>
              </Box>

              <Box className='footer-link-wrap'>
                <div className='title'>Other information</div>
                <Link to='/about-us' className='footer-link'>
                  About Us
                </Link>
                <Link to='/contact' className='footer-link'>
                  Contact Us
                </Link>
                <Link to='/faq' className='footer-link'>
                  FAQ
                </Link>
              </Box>
            </Box>

            <Box sx={{ borderTop: '1px solid var(--Light-Blue---Primary-700, #081f44)' }}></Box>

            <Box className='footer-bottom'>
              <Box className='footer-bottom-links'>
                <Box className='footer-link'>English</Box>
                <Box className='dot'></Box>
                <Box className='footer-link'></Box>
                <Link to='/privacy-policy' className='footer-link'>
                  Privacy Policy
                </Link>
                <Box className='dot'></Box>
                <Link to='/terms-conditions' className='footer-link'>
                  Terms & Conditions
                </Link>
              </Box>

              <Box className='copy-right'>Copyright by © FixGlass Company No.11808031. All rights reserved.</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
