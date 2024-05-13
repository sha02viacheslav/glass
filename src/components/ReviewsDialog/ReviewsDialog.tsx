import './ReviewsDialog.css'
import React, { useState } from 'react'
import { Modal } from '@mui/material'
import { GoogleReviews } from '../Footer/GoogleReviews'

export type ReviewsDialogProps = {
  onClose?: () => void
}

export const ReviewsDialog: React.FC<ReviewsDialogProps> = ({ onClose = () => undefined }) => {
  const [showReviewDialog, setShowReviewDialog] = useState<boolean>(false)
  return (
    <>
      <div className='d-inline-flex align-items-center cursor-pointer' onClick={() => setShowReviewDialog(true)}>
        {[1, 2, 3, 4, 5].map((index) => (
          <img key={index} src={'/images/star.svg'} className='img-fluid' alt='' />
        ))}
        <div className='lh-15 text-white ms-1'>5.0</div>
        <img src={process.env.PUBLIC_URL + '/images/google.png'} className='img-fluid ms-1' alt='' />
        <div className='lh-15 text-white ms-2'>reviews</div>
      </div>
      <Modal
        open={showReviewDialog}
        aria-labelledby='child-modal-title'
        disableAutoFocus={true}
        aria-describedby='child-modal-description'
      >
        <div className='reviews-dialog'>
          <div className='reviews-modal-header'>
            <img
              src={process.env.PUBLIC_URL + '/images/close.svg'}
              className='close-btn'
              alt=''
              onClick={() => {
                setShowReviewDialog(false)
                onClose()
              }}
            />

            <div className='title'>
              <img src={process.env.PUBLIC_URL + '/images/google1.png'} className='img-fluid' alt='' />
              <div>reviews</div>
            </div>
            <div className='stars'>
              <img src={process.env.PUBLIC_URL + '/images/star1.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/star1.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/star1.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/star1.svg'} className='img-fluid' alt='' />
              <img src={process.env.PUBLIC_URL + '/images/star1.svg'} className='img-fluid' alt='' />
              <div className='ms-2'>5.0</div>
            </div>
            <div className='description'>Average review rating at the moment</div>
          </div>

          <div className='padding-32'></div>

          <div className='d-flex flex-column'>
            <GoogleReviews />
          </div>
        </div>
      </Modal>
    </>
  )
}
