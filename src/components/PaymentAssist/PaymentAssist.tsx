import React from 'react'
import { useParams } from 'react-router-dom'
import './payment-assist.css'

export const PaymentAssist: React.FC = () => {
  const { status } = useParams()

  return (
    <div className='center'>
      {status === 'success' ? (
        <div className='PA-info-container'>
          <h2 className='PA-thank-you-header'>Your payment was successful!</h2>
          <h1 className='PA-extra-info'>You can close this window.</h1>
        </div>
      ) : undefined}
      {status === 'failed' ? (
        <div className='PA-info-container'>
          <h2 className='PA-thank-you-header'>There was an error and your payment was unsuccessful.</h2>
          <h1 className='PA-extra-info'>You can close this window.</h1>
        </div>
      ) : undefined}
    </div>
  )
}
