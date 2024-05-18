import React from 'react'
import { CardMedia, Link as MuiLink, Tooltip, Typography } from '@mui/material'
import { PHONE_NUMBER } from '@glass/constants'

export const QuickCall: React.FC = ({}) => {
  return (
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
        sx={{ width: 20, height: 20, cursor: 'pointer' }}
        image={process.env.PUBLIC_URL + '/images/help-circle.svg'}
      />
    </Tooltip>
  )
}
