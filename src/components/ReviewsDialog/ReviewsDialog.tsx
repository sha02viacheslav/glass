import './ReviewsDialog.css'
import React from 'react'
import { Modal } from '@mui/material'
import { GoogleReviews } from '../Footer/GoogleReviews'

export type ReviewsDialogProps = {
  onClose: () => void
}

export const ReviewsDialog: React.FC<ReviewsDialogProps> = ({ onClose }) => {
  return (
    <Modal
      open={true}
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
            onClick={() => onClose()}
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
  )
}
