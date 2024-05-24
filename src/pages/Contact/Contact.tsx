import React from 'react'
import { Box, Link, Typography } from '@mui/material'
import { startWhatsApp } from '@glass/utils/whats-app/whats-app.util'

export const Contact: React.FC = () => {
  const workshops = [
    {
      name: 'Head Office',
      address: '85 Great Portland Street London, W1W 7LT',
      phone: '+44 7400 400469',
      email: 'hello@fix.glass',
    },
  ]

  return (
    <Box>
      <Box sx={{ py: { xs: 20, lg: 24 } }}></Box>

      <Box
        sx={{
          background: { lg: 'url(/images/contact-us.png) center / cover no-repeat' },
          py: { lg: 24 },
        }}
      >
        <Box className='container'>
          <Box sx={{ pb: 6, borderBottom: { xs: 'solid 1px #f2f2f2', lg: 'none' } }}>
            <Typography
              sx={{
                color: 'var(--Light-Blue---Primary-600, #133f85)',
                fontSize: { xs: 12, lg: 16 },
                lineHeight: '130%',
                letterSpacing: '0.84px',
                textTransform: 'uppercase',
              }}
            >
              HOW can we help you?
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 24, lg: 60 },
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '130%',
                marginTop: 4,
              }}
            >
              Contact us
            </Typography>
            <Typography
              sx={{
                color: 'var(--Gray-600, #6a6b71)',
                fontSize: { xs: 16, lg: 20 },
                lineHeight: '170%',
                marginTop: 3,
                maxWidth: 600,
              }}
            >
              We&apos;re here to help and answer any questions you have. We&apos;re excited to hear from you and assist
              you in any way we can!
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 16, lg: 20 },
                lineHeight: '170%',
                marginTop: 8,
                maxWidth: 600,
              }}
            >
              Our office is registered in London <br />
              but we offer service in different parts of UK.
            </Typography>
          </Box>

          <div>
            {workshops.map((workshop, index) => (
              <Box
                key={index}
                sx={{
                  py: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
                className='workshop-wrap'
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: { xs: 16, lg: 20 },
                    fontWeight: 600,
                    lineHeight: '24px',
                  }}
                  className='list-item'
                >
                  <img src={process.env.PUBLIC_URL + '/images/map-marker.svg'} className='img-fluid' alt='' />
                  <div>85 Great Portland Street, London, W1W 7LT</div>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: { xs: 16, lg: 20 },
                    fontWeight: 600,
                    lineHeight: '24px',
                  }}
                  className='list-item'
                >
                  <img src={process.env.PUBLIC_URL + '/images/phone.svg'} className='img-fluid' alt='' />
                  <Box
                    sx={{ color: 'var(--Light-Blue---Primary-500, #225fc2)' }}
                    onClick={() => startWhatsApp(workshop.phone)}
                  >
                    {workshop.phone}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    fontSize: { xs: 16, lg: 20 },
                    fontWeight: 600,
                    lineHeight: '24px',
                  }}
                  className='list-item'
                >
                  <img src={process.env.PUBLIC_URL + '/images/email.svg'} className='img-fluid' alt='' />
                  <Link
                    href={'mailto:' + workshop.email}
                    target='_blank'
                    rel='noreferrer'
                    sx={{ color: 'var(--Light-Blue---Primary-500, #225fc2)' }}
                  >
                    {workshop.email}
                  </Link>
                </Box>
              </Box>
            ))}
          </div>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 16, lg: 25 } }}></Box>
    </Box>
  )
}
