import React, { ReactNode, useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'

export type ProcessCardProps = {
  title: string
  children?: ReactNode
}

export const ProcessCard: React.FC<ProcessCardProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <Box
      sx={{
        p: { xs: '8px 12px 24px 12px', lg: '24px 32px' },
        borderRadius: '2px',
        background: expanded ? '#f5f9ff' : '#fff',
        boxShadow:
          '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--24, 24px)',
          alignSelf: 'stretch',
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Typography
          sx={{
            color: 'var(--Gray-700, #474747)',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '150%',
            letterSpacing: '-0.16px',
          }}
        >
          {title}
        </Typography>
        <CardMedia
          component='img'
          sx={{ width: 24, height: 24, transition: 'all 300ms', transform: expanded ? 'rotate(180deg)' : '' }}
          image={process.env.PUBLIC_URL + '/images/chevron-down.svg'}
        />
      </Box>

      <Box
        sx={{
          lineHeight: '170%',
          height: expanded ? 'auto' : 0,
          overflow: expanded ? 'visible' : 'hidden',
          transition: 'all 300ms',
        }}
      >
        <Box sx={{ pt: 6 }}>{children}</Box>
      </Box>
    </Box>
  )
}
