import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom'

export type DesktopLinkProps = {
  title: string
  description: string
  to: string
  onClick: () => void
}

export const DesktopLink: React.FC<DesktopLinkProps> = ({ title, description, to, onClick }) => {
  const navigate = useNavigate()
  const resolvedPath = useResolvedPath(to)
  const isActive = to ? useMatch({ path: resolvedPath.pathname, end: true }) : false

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 8,
        borderRadius: '8px',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        height: '100%',
        background: isActive ? 'var(--Gray-000, #F7F7F8)' : '#fff',
        transform: isActive ? 'translateY(-10px)' : '',
        transition: '0.3s all',
        '&:hover': {
          background: 'var(--Gray-000, #F7F7F8)',
          transform: 'translateY(-10px)',
        },
      }}
      onClick={() => {
        navigate(to)
        onClick()
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: '700', lineHeight: '130%' }}>{title}</Typography>
      <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', lineHeight: '170%', mt: 3, flex: '1' }}>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
        <CardMedia
          component='img'
          sx={{ width: 24, height: 24, cursor: 'pointer' }}
          image={process.env.PUBLIC_URL + '/images/arrow-right-black.svg'}
        />
      </Box>
    </Box>
  )
}
