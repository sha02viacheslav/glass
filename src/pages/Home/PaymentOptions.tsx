import './PaymentOptions.css'
import React from 'react'

export const PaymentOptions: React.FC = () => {
  return (
    <section className='sec-payment-options'>
      <div className='title'>Our payment options</div>
      <div>
        <div className='payment-options-wrap'>
          <div className='header'>
            <img src={process.env.PUBLIC_URL + '/images/payment-options-monthly.svg'} className='img-fluid' alt='' />
            <div>Monthly payments</div>
          </div>
          <ul>
            <li>fast and easy setup with your debit card</li>
            <li>0% interest installment plan </li>
            <li>Pay a small deposit to secure your booking</li>
          </ul>
        </div>
        <div className='payment-options-wrap'>
          <div className='header'>
            <img src={process.env.PUBLIC_URL + '/images/payment-options-card.svg'} className='img-fluid' alt='' />
            <div>Debit or credit card online payment</div>
          </div>
          <ul>
            <li>We accept all major credit and debit cards</li>
          </ul>
          <div className='cards d-flex gap-3 mt-1'>
            <img src={process.env.PUBLIC_URL + '/images/master-card.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/visa.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/discover.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/amex.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/union-pay.svg'} className='img-fluid' alt='' />
            <img src={process.env.PUBLIC_URL + '/images/jcb.svg'} className='img-fluid' alt='' />
          </div>
        </div>
      </div>
      <div className='description'>
        If you want to find out more, don&apos;t hesitate to call sales at <span className='phone'>07400 400469</span>
      </div>
    </section>
  )
}
