import React, { useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { toast } from 'react-toastify'
import { EnumLoader } from 'src/core/enums/loader.enum'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { stopCancelBookingService } from '@glass/services/apis/stop-cancel-booking.service'

export type QuoteCancellingProps = {
  quoteId: string
  onStopCancelBooking: () => void
}

export const QuoteCancelling: React.FC<QuoteCancellingProps> = ({ quoteId, onStopCancelBooking }) => {
  const [showStopCancelBookingPopup, setShowStopCancelBookingPopup] = useState<boolean>(false)

  const stopCancelBooking = () => {
    if (!quoteId) return

    trackPromise(
      stopCancelBookingService(quoteId).then((res) => {
        if (res.success) {
          onStopCancelBooking()
        } else {
          toast(res.message)
        }
      }),
      EnumLoader.SAVE_QUOTE,
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          borderRadius: '2px',
          background: '#fff',
          px: { xs: 4, lg: 6 },
          py: { xs: 6, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 500,
        }}
      >
        <CardMedia
          component='img'
          sx={{ width: 96, height: 96 }}
          image={process.env.PUBLIC_URL + '/images/cancelling.svg'}
        ></CardMedia>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: 24, lg: 36 },
            fontWeight: '600',
            lineHeight: '160%',
            letterSpacing: '-0.16px',
            mt: 6,
          }}
        >
          Cancelling your booking...
        </Typography>
        <Typography
          sx={{
            color: 'var(--Gray-600, #6A6B71)',
            textAlign: 'center',
            fontSize: { xs: 16, lg: 20 },
            lineHeight: '160%',
            letterSpacing: '-0.14px',
            mt: 4,
          }}
        >
          Are agents needs few minutes to cancel your booking. All the money will be refunded.
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: { xs: 16, lg: 20 },
            fontWeight: '600',
            lineHeight: '160%',
            letterSpacing: '-0.16px',
            mt: 12,
          }}
        >
          We will notify you when cancelled.
        </Typography>
      </Box>

      <Box sx={{ mt: 16, width: { xs: '100%', lg: 358 } }}>
        <button type='button' className='btn-raised w-100' onClick={() => setShowStopCancelBookingPopup(true)}>
          Don’t cancel the booking
        </button>
      </Box>

      {showStopCancelBookingPopup && (
        <ConfirmDialog
          title='Stop booking cancelation'
          showIcon={false}
          description={
            <span className='text-left d-block'>
              Do you want to stop booking cancelation and proceed with replacement?
            </span>
          }
          confirmStr='Yes, stop'
          cancelStr='No, proceed'
          onCancel={() => setShowStopCancelBookingPopup(false)}
          onConfirm={() => {
            setShowStopCancelBookingPopup(false)
            stopCancelBooking()
          }}
        />
      )}
    </Box>
  )
}
