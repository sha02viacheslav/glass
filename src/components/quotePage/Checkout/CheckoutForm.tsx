import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StripePaymentElementChangeEvent } from '@stripe/stripe-js'
import { updatePaymentMethod } from '@glass/services/apis/succeed-payment.service'
import './checkout.css'

export type CheckoutFormProps = {
  amount: number
  clientSecret: string
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, clientSecret }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState('')
  const [valid, setValid] = useState(false)

  const handleCardChange = (event: StripePaymentElementChangeEvent) => {
    if (event.complete) setValid(true)
    else setValid(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setErr('')
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required',
    })

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      setErr(result.error.message || '')
    } else {
      let status = false
      // 3D secure authentication
      if (result.paymentIntent.status == 'requires_action') {
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret)
        if (error) {
          setErr('Error in payment, please try again later')
          return
        }
        if (paymentIntent.status === 'succeeded') {
          setSuccess(true)
          status = true
        }
      }
      if (result.paymentIntent.status == 'succeeded') {
        setSuccess(true)
        status = true
      }
      // payment success
      if (status) {
        updatePaymentMethod(result.paymentIntent.id, result.paymentIntent.client_secret).then(() => {})
      }
    }
  }

  if (success)
    return (
      <div className='mt-2 h5 py-4 success-msg'>
        <svg
          className='sn-1mj7mtw sn-1njhk9w pay-success'
          aria-hidden='true'
          height='16'
          viewBox='0 0 16 16'
          width='16'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M5.297 13.213.293 8.255c-.39-.394-.39-1.033 0-1.426s1.024-.394 1.414 0l4.294 4.224 8.288-8.258c.39-.393 1.024-.393 1.414 0s.39 1.033 0 1.426L6.7 13.208a.994.994 0 0 1-1.402.005z'
            fillRule='evenodd'
          ></path>
        </svg>
        <div>Payment success</div>
      </div>
    )

  return (
    <form className='mt-2' onSubmit={handleSubmit}>
      {err && <div className='h6 text-left text-danger'>{err}</div>}
      <PaymentElement onChange={handleCardChange} />
      <button type='submit' disabled={!valid} className={`pay-now mt-2 ${!valid ? 'invalid' : ''}`}>
        <div className='pay-text'>Pay £{amount}</div>
        {!valid && (
          <svg
            className='sn-1mj7mtw sn-1njhk9w pay-icon'
            aria-hidden='true'
            height='16'
            viewBox='0 0 16 16'
            width='16'
            xmlns='http://www.w3.org/2000/svg'
            fill='#ffffff'
          >
            <path
              d='M3 7V5a5 5 0 1 1 10 0v2h.5a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1zm5 2.5a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zM11 7V5a3 3 0 1 0-6 0v2z'
              fillRule='evenodd'
            ></path>
          </svg>
        )}
      </button>
      <div className='terms mt-3'>
        Powered by <b>stripe</b> <span style={{ marginLeft: 12, marginRight: 12 }}>|</span>{' '}
        <a href='https://stripe.com/legal/payment-terms' rel='noopener noreferrer' target='_blank'>
          Terms
        </a>
        &nbsp;
        <a href='https://stripe.com/privacy' rel='noopener noreferrer' target='_blank'>
          Privacy
        </a>
      </div>
    </form>
  )
}
