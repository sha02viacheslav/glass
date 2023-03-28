import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutForm } from '@glass/components/quotePage/Checkout/CheckoutForm'
import { PaymentMethod } from '@glass/enums'
import { REACT_APP_STRIPE_PUBLIC_KEY } from '@glass/envs'
import './checkout.css'

// Make sure to call `loadStripe` outside a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY)

export type CheckoutProps = {
  method: PaymentMethod
  amount: number
}

export const Checkout: React.FC<CheckoutProps> = ({ method, amount }) => {
  return (
    <>
      {method === PaymentMethod.CARD && (
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} />
        </Elements>
      )}
    </>
  )
}
