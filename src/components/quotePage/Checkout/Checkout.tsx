import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useParams } from 'react-router-dom'
import { CheckoutForm } from '@glass/components/quotePage/Checkout/CheckoutForm'
import { PaymentMethodType } from '@glass/enums'
import { REACT_APP_STRIPE_PUBLIC_KEY } from '@glass/envs'
import { createIndentService } from '@glass/services/apis/create-indent.service'

export type CheckoutProps = {
  paymentMethodType: PaymentMethodType
  amount: number
  succeedPayment: () => void
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY)

export const Checkout: React.FC<CheckoutProps> = ({ paymentMethodType, amount, succeedPayment }) => {
  const { id } = useParams()
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (id && paymentMethodType === PaymentMethodType.STRIPE) {
      createIndentService(id).then((res) => {
        if (res.success) {
          setClientSecret(res.data.clientSecret)
        }
      })
    }
  }, [paymentMethodType])

  return (
    <>
      {paymentMethodType === PaymentMethodType.STRIPE && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} clientSecret={clientSecret} succeedPayment={succeedPayment} />
        </Elements>
      )}
    </>
  )
}
