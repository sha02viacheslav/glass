import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Chat } from '@glass/components/Chat'
import { Partners } from '@glass/components/Partners/Partners'
import { PlantTree } from '@glass/components/PlantTree'

export const AboutUs: React.FC = () => {
  const services = [
    {
      title: '1000+ customers',
      description:
        'Benefit from the expertise of 1000+ satisfied customers who rely on us for top-notch car glass repair services at FixGlass.',
    },
    {
      title: '98% Satisfaction rate',
      description:
        'Benefit from the expertise of 1000+ satisfied customers who rely on us for top-notch car glass repair services at FixGlass.-',
    },
    {
      title: '2000+ glass repairs',
      description:
        'Choose FixGlass for your car&apos;s glass needs, where we&apos;ve completed over 2000+ successful repairs, ensuring quality and reliability every time',
    },
  ]

  return (
    <Box>
      <Box sx={{ py: { xs: 20, lg: 32 } }}></Box>

      <Box className='container'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', lg: 'center' },
          }}
        >
          <Typography
            sx={{
              color: 'var(--Light-Blue---Primary-600, #133f85)',
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 12, lg: 16 },
              lineHeight: '130%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            About us
          </Typography>
          <Typography
            sx={{
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 24, lg: 72 },
              fontWeight: 700,
              lineHeight: '130%',
              marginTop: { xs: 4, lg: 8 },
              maxWidth: 962,
            }}
          >
            Get to Know Us: Car Glass Experts at Your Service
          </Typography>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6a6b71)',
              textAlign: { xs: 'left', lg: 'center' },
              fontSize: { xs: 16, lg: 30 },
              lineHeight: '170%',
              marginTop: { xs: 3, lg: 6 },
              maxWidth: 704,
            }}
          >
            We&apos;re dedicated professionals committed to top-quality glass repairs, prioritizing safety and
            reliability.
          </Typography>
        </Box>
        <Box
          sx={{
            mt: { xs: 8, lg: 24 },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 120, lg: 400 },
              height: { xs: 120, lg: 400 },
              background: 'url(/images/logo.svg) center / contain no-repeat',
            },
          }}
        >
          <CardMedia
            component='img'
            sx={{ width: '100%', height: 'auto' }}
            image={process.env.PUBLIC_URL + '/images/about-us.png'}
          />
        </Box>
      </Box>

      <Box sx={{ py: { xs: 4, lg: 16 } }}></Box>

      <Box
        sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row-reverse' }, gap: { xs: 8, lg: 12 } }}
        className='container'
      >
        <Box>
          <Typography
            sx={{
              color: 'var(--Light-Blue---Primary-600, #133f85)',
              fontSize: { xs: 12, lg: 16 },
              lineHeight: '130%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            Our mission
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 24, lg: 48 },
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '130%',
              marginTop: 4,
              maxWidth: 962,
            }}
          >
            Keeping Your Vehicle Safe and Clear
          </Typography>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6a6b71)',
              fontSize: { xs: 16, lg: 20 },
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '170%',
              marginTop: 3,
              maxWidth: 704,
            }}
          >
            Our mission is to deliver convenient, quick and top-quality glass repair by professionals.
          </Typography>
        </Box>
        <Box>
          <CardMedia
            component='img'
            sx={{ width: { xs: '100%', lg: 'auto' }, height: { xs: 'auto', lg: 364 } }}
            image={process.env.PUBLIC_URL + '/images/our-mission.png'}
          />
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Box
        sx={{
          p: {
            xs: '24px 16px 32px 16px',
            lg: '48px 16px',
            background: 'url(/images/our-vision.png) center / cover no-repeat',
          },
        }}
      >
        <Box className='container'>
          <Typography
            sx={{
              color: 'var(--Light-Blue---Primary-100, #bad2f7)',
              fontSize: { xs: 12, lg: 16 },
              lineHeight: '130%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            Our Vision
          </Typography>
          <Typography
            sx={{
              color: '#f4f0fe',
              fontSize: { xs: 24, lg: 48 },
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '150%',
              letterSpacing: '-0.24px',
              marginTop: '16px',
            }}
          >
            Our vision is to offer seamless and reliable mobile car glass repair, giving our customers confidence and
            peace of mind.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Box className='container'>
        <Box sx={{ maxWidth: 857 }}>
          <Typography
            sx={{
              color: 'var(--Light-Blue---Primary-600, #133f85)',
              fontSize: { xs: 12, lg: 16 },
              lineHeight: '130%',
              letterSpacing: '0.84px',
              textTransform: 'uppercase',
            }}
          >
            Our service in numbers
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 24, lg: 48 },
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '130%',
              marginTop: 4,
              maxWidth: 962,
            }}
          >
            FixGlass: Empowering Car Glass Repair in Numbers
          </Typography>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6a6b71)',
              fontSize: { xs: 16, lg: 20 },
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '170%',
              marginTop: 3,
              maxWidth: 704,
            }}
          >
            Experience seamless glass repairs with FixGlass, your trusted destination for restoring your car&apos;s
            windshield and windows.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, mt: { xs: 10, lg: 16 } }}>
            {services.map((item, index) => (
              <Box
                key={index}
                sx={{
                  pl: 6,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: { xs: 32, lg: 48 },
                    borderLeft: '2px solid var(--Light-Blue---Primary-600, #133f85)',
                  },
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--Gray-700, #474747)',
                    fontSize: { xs: 20, lg: 30 },
                    fontWeight: 400,
                    lineHeight: '130%',
                    py: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: 'var(--Gray-600, #6a6b71)',
                    fontSize: { xs: 16, lg: 20 },
                    fontWeight: 300,
                    lineHeight: '150%',
                    marginTop: '8px',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Box className='container'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row-reverse' },
            borderRadius: '2px',
            gap: { lg: 12 },
            boxShadow: {
              xs: '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
              lg: 'none',
            },
          }}
        >
          <Box
            sx={{
              height: { xs: 200, lg: 'auto' },
              width: { xs: '100%', lg: '48%' },
              padding: '16px 24px 16px 16px',
              background: 'url(/images/our-story.png) center / cover no-repeat',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <Box sx={{ display: { lg: 'none' } }}>
              <Typography
                sx={{
                  color: 'var(--Light-Blue---Primary-000, #e8f0fe)',
                  fontSize: '12px',
                  lineHeight: '130%',
                  letterSpacing: '0.84px',
                  textTransform: 'uppercase',
                }}
              >
                Our story
              </Typography>
              <Typography
                sx={{
                  color: 'var(--Light-Blue---Primary-000, #e8f0fe)',
                  fontSize: '24px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '140%',
                }}
              >
                FixGlass&apos; Story. From the Words of Our Founder
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box sx={{ p: { xs: '16px 12px 32px 12px', lg: 0 }, flex: 1 }}>
              <Typography
                sx={{
                  display: { lg: 'none' },
                  color: 'var(--Gray-800, #14151f)',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '170%',
                }}
              >
                Hi, I&apos;m Arvin.
              </Typography>
              <Typography
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  color: 'var(--Light-Blue---Primary-600, #133f85)',
                  fontSize: { xs: 12, lg: 16 },
                  lineHeight: '130%',
                  letterSpacing: '0.84px',
                  textTransform: 'uppercase',
                }}
              >
                Our Story
              </Typography>
              <Typography
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  fontSize: { xs: 24, lg: 48 },
                  fontWeight: 700,
                  lineHeight: '130%',
                  marginTop: 4,
                }}
              >
                FixGlass&apos; Story. From the Words of Our Founder
              </Typography>
              <Typography
                sx={{
                  color: 'var(--Gray-700, #474747)',
                  fontSize: { xs: 16, lg: 20 },
                  fontWeight: 400,
                  lineHeight: '170%',
                  marginTop: { xs: 1, lg: 3 },
                }}
              >
                If you have few minutes a would love to share a story of how FixGlass was founded and my journey to
                providing top-notch mobile glass repairs.
              </Typography>
            </Box>
            <Box
              sx={{
                mt: { lg: 12 },
                button: {
                  width: { xs: '100%', lg: 'auto' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--12, 12px) 20px',
                  gap: 'var(--8, 8px)',
                  borderRadius: '2px',
                  background: 'var(--Light-Blue---Primary-000, #e8f0fe)',
                  color: 'var(--Light-Blue---Primary-700, #081f44)',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '24px',
                  letterSpacing: '-0.16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, color 0.3s',
                  '&:hover': {
                    background: 'var(--Light-Blue---Primary-200, #bad1f7)',
                    color: 'var(--Light-Blue---Primary-900, #081f44)',
                  },
                },
              }}
            >
              <button>
                <span>Read the full story</span>
                <img src={process.env.PUBLIC_URL + '/images/arrow-right-blue.svg'} className='img-fluid' alt='' />
              </button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <Partners />

      <Box sx={{ py: { xs: 8, lg: 16 } }}></Box>

      <PlantTree />

      <Box sx={{ py: { xs: 16, lg: 25 } }}></Box>

      <Chat />
    </Box>
  )
}
