import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'

export type ProcessItemProps = {
  title: string
  description: string
  image?: string
  video?: string
  topDescription?: string
  bottomDescription?: string
  showCheckMark?: boolean
  showCloseMark?: boolean
}

export const ProcessItem: React.FC<ProcessItemProps> = ({
  title,
  description,
  image,
  video,
  topDescription,
  bottomDescription,
  showCheckMark,
  showCloseMark,
}) => {
  return (
    <Box
      sx={{
        pl: 12,
        pb: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          position: 'absolute',
          top: { xs: 0, lg: '7px' },
          left: '0',
          background: '#133f85',
        },
        '&:not(:last-child)::after': {
          content: '""',
          width: '6px',
          height: 'calc(100% - 12px)',
          position: 'absolute',
          top: { xs: '12px', lg: '19px' },
          left: '9px',
          background: '#133f85',
        },
      }}
    >
      <Typography sx={{ fontSize: { xs: 16, lg: 24 }, fontWeight: '600', lineHeight: '160%' }}>{title}</Typography>
      <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
        {!!image && (
          <Box
            sx={{
              width: { xs: 132, lg: 360 },
              height: { xs: 132, lg: 360 },
              borderRadius: '2px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            <CardMedia
              component='img'
              sx={{
                width: { xs: 'calc(100% + 8px)', lg: 'calc(100% + 24px)' },
                height: { xs: 'calc(100% + 8px)', lg: 'calc(100% + 24px)' },
                m: { xs: -1, lg: -3 },
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              image={image}
            />
            {!!topDescription && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  padding: '2px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(1px)',
                  color: '#000',
                  fontSize: { xs: 12, lg: 24 },
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: { xs: '16px', lg: '42px' },
                  letterSpacing: { xs: '-0.24px', lg: '-0.48px' },
                  textAlign: 'center',
                }}
              >
                {topDescription}
              </Box>
            )}
            {!!bottomDescription && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '2px',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(1px)',
                  color: '#000',
                  fontSize: { xs: 12, lg: 24 },
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: { xs: '16px', lg: '42px' },
                  letterSpacing: { xs: '-0.24px', lg: '-0.48px' },
                  textAlign: 'center',
                }}
              >
                {bottomDescription}
              </Box>
            )}
            {!!showCheckMark && (
              <CardMedia
                component='img'
                sx={{
                  position: 'absolute',
                  top: { xs: '26px', lg: 56 },
                  left: { xs: '6px', lg: '10px' },
                  width: { xs: '16px !important', lg: '32px !important' },
                  height: { xs: '16px !important', lg: '32px !important' },
                }}
                image={process.env.PUBLIC_URL + '/images/checkbox-marked-circle.svg'}
              />
            )}
            {!!showCloseMark && (
              <CardMedia
                component='img'
                sx={{
                  position: 'absolute',
                  top: 'calc(50% + 4px)',
                  left: { xs: '6px', lg: '10px' },
                  width: { xs: '16px !important', lg: '32px !important' },
                  height: { xs: '16px !important', lg: '32px !important' },
                }}
                image={process.env.PUBLIC_URL + '/images/close-circle.svg'}
              />
            )}
          </Box>
        )}
        <Typography
          sx={{
            color: 'var(--Gray-700, #474747)',
            fontSize: { xs: 14, lg: 20 },
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '170%',
            flex: '1',
          }}
        >
          {description}
        </Typography>
      </Box>

      {!!video && (
        <blockquote className='twitter-tweet' data-media-max-width='648'>
          <a href={'https://twitter.com/fix_glass_/status/' + video + '?ref_src=twsrc%5Etfw'}></a>
        </blockquote>
      )}
    </Box>
  )
}
