import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useParams } from 'react-router-dom'
import { PaymentMethodType } from '@glass/enums'
import { REACT_APP_STRIPE_PUBLIC_KEY } from '@glass/envs'
import { Quote } from '@glass/models'
import { createIndentService } from '@glass/services/apis/create-indent.service'
import { StripePaymentForm } from './StripePaymentForm'

export type QuoteStripePaymentProps = {
  quoteDetails: Quote
  totalPrice: number
  onBack: () => void
  onSucceed: () => void
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY)

export const QuoteStripePayment: React.FC<QuoteStripePaymentProps> = ({
  quoteDetails,
  totalPrice,
  onBack,
  onSucceed,
}) => {
  const { id: quoteId } = useParams()

  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (quoteId && quoteDetails?.payment_method_type === PaymentMethodType.STRIPE) {
      createIndentService(quoteId).then((res) => {
        if (res.success) {
          setClientSecret(res.data.clientSecret)
        }
      })
    }
  }, [quoteDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <Box>
      <Box sx={{ paddingX: 4, marginBottom: 40 }}>
        <Typography sx={{ fontWeight: 400, lineHeight: '170%' }}>
          Please enter your card details so we can finish the payment.
        </Typography>

        <Box sx={{ mt: 6 }}>
          {quoteDetails?.payment_method_type === PaymentMethodType.STRIPE && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                amount={totalPrice}
                clientSecret={clientSecret}
                onBack={onBack}
                onSucceed={onSucceed}
              />
            </Elements>
          )}
        </Box>
      </Box>
    </Box>
  )
}
