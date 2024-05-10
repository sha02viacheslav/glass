import React, { ReactNode } from 'react'
import { Box, CardMedia, Modal } from '@mui/material'

export type FullScreenModalProps = {
  children: ReactNode
  onClose: () => void
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({ children, onClose }) => {
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#fff',
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            zIndex: '1001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: 4,
            borderBottom: '2px solid var(--Gray-100, #F2F2F3)',
            background: '#fff',
          }}
        >
          <CardMedia
            component='img'
            sx={{ width: 24, height: 24 }}
            image={process.env.PUBLIC_URL + '/images/close.svg'}
            onClick={() => onClose()}
          />
        </Box>

        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  )
}
