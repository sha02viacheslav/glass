import React from 'react'
import { Box, CardMedia, Modal, Typography } from '@mui/material'
import { Quote } from '@glass/models'

export type ExpiredDialogProps = {
  quoteDetails: Quote
  onConfirm: () => void
}

export const ExpiredDialog: React.FC<ExpiredDialogProps> = ({ quoteDetails, onConfirm }) => {
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
          <Typography
            sx={{ textAlign: 'center', fontSize: 24, fontWeight: '700', lineHeight: '28px', letterSpacing: '-0.24px' }}
          >
            {'Hey ' + quoteDetails.customer_f_name + ', looks like your slot has expired :('}
          </Typography>
          <CardMedia
            sx={{ width: 160, height: 160, mt: 8 }}
            component='img'
            image={process.env.PUBLIC_URL + '/images/sand-timer.png'}
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
            To proceed with payment you need to select new booking slot.
          </Typography>
          <button className='btn-raised w-100' onClick={onConfirm}>
            Select new booking slot
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
