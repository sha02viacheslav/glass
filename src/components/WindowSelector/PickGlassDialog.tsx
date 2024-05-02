import './PickGlassDialog.css'
import React from 'react'
import { Box, Typography } from '@mui/material'

export type PickGlassDialogProps = {
  title: string
  description: string
  onConfirm: () => void
}

export const PickGlassDialog: React.FC<PickGlassDialogProps> = ({ title, description, onConfirm }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '0',
        left: '44px',
        width: '144px',
        transform: 'translateY(-50%)',
        height: 'auto',
        backgroundColor: '#EDF1F7',
        boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        p: { xs: '12px 16px 8px' },
        zIndex: '100',
      }}
    >
      <Box>
        <Typography
          sx={{
            color: 'var(--Gray-800, #14151F)',
            fontFamily: 'Nunito Sans',
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '20px',
            letterSpacing: '0.1px',
          }}
        >
          {title}
        </Typography>
        <Typography
          marginTop={1}
          sx={{
            color: 'var(--Gray-800, #14151F)',
            fontFamily: 'Nunito Sans',
            fontSize: '14px',
            fontWeight: '400',
            lineHeight: '20px',
            letterSpacing: '0.25px',
          }}
        >
          {description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '12px',
            gap: { xs: '24px', md: '40px' },
          }}
        >
          <button className='btn-transparent small pick-glass-confirm' onClick={onConfirm}>
            Okay
          </button>
        </Box>
      </Box>
    </Box>
  )
}
