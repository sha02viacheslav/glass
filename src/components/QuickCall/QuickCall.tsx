import React from 'react'
import { CardMedia, Link as MuiLink, Tooltip, Typography } from '@mui/material'
import { PHONE_NUMBER } from '@glass/constants'

export const QuickCall: React.FC = ({}) => {
  return (
    <>
      <Tooltip
        title={
          <React.Fragment>
            <Typography sx={{ color: '#fff', fontSize: 12, lineHeight: '16px' }}>
              Need some help?{' '}
              <MuiLink
                href={`tel:${PHONE_NUMBER}`}
                sx={{
                  color: '#fff',
                  textDecoration: 'underline',
                  '&:hover': {
                    color: '#fff',
                  },
                }}
              >
                Call us
              </MuiLink>
            </Typography>
          </React.Fragment>
        }
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -8],
                },
              },
            ],
          },
        }}
      >
        <CardMedia
          component='img'
          sx={{ display: { lg: 'none' }, width: 20, height: 20, cursor: 'pointer' }}
          image={process.env.PUBLIC_URL + '/images/help-circle.svg'}
        />
      </Tooltip>

      <Typography
        sx={{
          display: { xs: 'none', lg: 'block' },
          color: 'var(--Gray-700, #474747)',
          fontSize: 20,
          lineHeight: '140%',
        }}
      >
        Need some help? Call us on{' '}
        <MuiLink
          href={`tel:${PHONE_NUMBER}`}
          sx={{
            color: 'var(--Gray-700, #474747)',
            fontWeight: '700',
            '&:hover': {
              color: 'var(--Gray-700, #474747)',
            },
          }}
        >
          {PHONE_NUMBER}
        </MuiLink>
      </Typography>
    </>
  )
}
