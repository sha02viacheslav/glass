import React, { useEffect, useState } from 'react'
import { Box, CardMedia } from '@mui/material'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StripePaymentElementChangeEvent } from '@stripe/stripe-js'
import { trackPromise } from 'react-promise-tracker'
import { Loader } from '@glass/components/Loader'
import { updatePaymentStatusService } from '@glass/services/apis/update-payment-status.service'
import { scrollToElementWithOffset } from '@glass/utils/scroll-to-element/scroll-to-element.util'

export type StripePaymentFormProps = {
  amount: number
  clientSecret: string
  onBack: () => void
  onSucceed: () => void
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, clientSecret, onBack, onSucceed }) => {
  const stripe = useStripe()
  const elements = useElements()

  const [err, setErr] = useState('')
  const [valid, setValid] = useState(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)

  const handleCardChange = (event: StripePaymentElementChangeEvent) => {
    if (event.complete) setValid(true)
    else setValid(false)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    setTimeout(() => {
      scrollToElementWithOffset('PM-button-wrap-title', 10)
    })

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setErr('Script not loaded, please refresh or try again later')
      return
    }

    setErr('')

    setSubmitted(true)

    const confirmPaymentResult = await trackPromise(
      stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect: 'if_required',
      }),
    )

    if (confirmPaymentResult.error) {
      // Show error to your customer (for example, payment details incomplete)
      setErr(confirmPaymentResult.error.message || '')
      setSubmitted(false)
      return
    }

    let status = false
    // 3D secure authentication
    if (confirmPaymentResult.paymentIntent.status == 'requires_action') {
      const { paymentIntent, error } = await trackPromise(stripe.confirmCardPayment(clientSecret))
      if (error) {
        setErr('Error in payment, please try again later')
        setSubmitted(false)
        return
      }
      if (paymentIntent.status === 'succeeded') {
        status = true
      }
    }

    if (confirmPaymentResult.paymentIntent.status == 'succeeded') {
      status = true
    }

    await trackPromise(
      updatePaymentStatusService(
        confirmPaymentResult.paymentIntent.id,
        confirmPaymentResult.paymentIntent.client_secret,
        status ? 'success' : 'Failed',
      )
        .then(() => {
          onSucceed()
        })
        .catch(() => {}),
    )
  }

  useEffect(() => {
    if (!!stripe && !!elements) {
      setScriptLoaded(true)
    }
  }, [stripe, elements])

  return (
    <form onSubmit={handleSubmit}>
      <Loader loading={!scriptLoaded} />

      {valid && err && <small className='formError'>{err}</small>}

      <PaymentElement onChange={handleCardChange} />

      <Box
        sx={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100vw',
          zIndex: '100',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: 3,
          borderTop: '1px solid var(--Gray-100, #f2f2f3)',
          background: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <button className='btn-transparent' type='button' onClick={() => onBack()}>
            <CardMedia
              component='img'
              sx={{ width: 24, height: 'auto', marginLeft: -2 }}
              image={process.env.PUBLIC_URL + '/images/chevron-left.svg'}
            />
            Back
          </button>
          <button className='btn-raised' type='submit' disabled={submitted}>
            Book & Pay £{amount}
          </button>
        </Box>
      </Box>
    </form>
  )
}
