import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useParams } from 'react-router-dom'
import { CheckoutForm } from '@glass/components/quotePage/Checkout/CheckoutForm'
import { PaymentMethodType } from '@glass/enums'
import { REACT_APP_STRIPE_PUBLIC_KEY } from '@glass/envs'
import { createIndentService } from '@glass/services/apis/create-indent.service'
import { getInvoice } from '@glass/services/apis/invoice.service'

export type CheckoutProps = {
  method: PaymentMethodType
  amount: number
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLIC_KEY)

export const Checkout: React.FC<CheckoutProps> = ({ method, amount }) => {
  const { id } = useParams()
  const [invoiceNumber, setInvoiceNumber] = useState<string>('')
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (id) {
      getInvoice(id).then((res) => {
        if (res.success) {
          setInvoiceNumber(res.data.invoice_number)
        }
      })
    }
  }, [id])

  useEffect(() => {
    if (id && invoiceNumber) {
      createIndentService(id, invoiceNumber).then((res) => {
        if (res.success) {
          setClientSecret(res.data.clientSecret)
        }
      })
    }
  }, [invoiceNumber])

  return (
    <>
      {method === PaymentMethodType.STRIPE && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  )
}
