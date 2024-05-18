import React from 'react'
import { Box, CardMedia, Modal, Typography } from '@mui/material'

export type QuoteActiveDialogProps = {
  customerFirstName: string
  onConfirm: () => void
}

export const QuoteActiveDialog: React.FC<QuoteActiveDialogProps> = ({ customerFirstName, onConfirm }) => {
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
          width: '90%',
          height: 'auto',
          backgroundColor: '#EEF4F8',
          borderRadius: '12px',
          maxWidth: '450px',
          p: 6,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: '700',
                lineHeight: '28px',
                letterSpacing: '-0.24px',
              }}
            >
              {'Hey ' + customerFirstName + ', we detected active quote.'}
            </Typography>
            <CardMedia
              component='img'
              sx={{ width: 24, height: 24, cursor: 'pointer' }}
              image={process.env.PUBLIC_URL + '/images/close.svg'}
              onClick={onConfirm}
            />
          </Box>
          <CardMedia
            sx={{ width: 160, height: 160, mt: 8 }}
            component='img'
            image={process.env.PUBLIC_URL + '/images/car-ownership.svg'}
          />
          <Typography
            sx={{
              color: 'var(--Gray-700, #474747)',
              textAlign: 'center',
              fontWeight: '600',
              lineHeight: '24px',
              letterSpacing: '-0.16px',
              mt: 2,
              mb: 12,
            }}
          >
            An existing quote for your vehicle with registration number [registration number] already exists and it’s
            active.
          </Typography>
          <button className='btn-raised w-100' onClick={onConfirm}>
            See my quote
            <CardMedia
              component='img'
              sx={{ width: 24, height: 'auto', marginRight: -2 }}
              image={process.env.PUBLIC_URL + '/images/arrow-right.svg'}
            />
          </button>
        </Box>
      </Box>
    </Modal>
  )
}
