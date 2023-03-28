import {Elements, PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import api from '../../api'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({amount, clientSecret}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState("")

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setErr("")
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required'
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      setErr(result.error.message)
    } else {
      let status = false
      // 3D secure authentication
      if (result.paymentIntent.status == 'requires_action') {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          clientSecret
        );
        if (error) {
          setErr('Error in payment, please try again later')
          return
        }
        if (paymentIntent.status === "succeeded") {
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
        api.post('/invoice/payment/stripe/success', {
          params: {
            payment_intent: result.paymentIntent.id,
            redirect_status: "success",
            payment_intent_client_secret: result.paymentIntent.client_secret
          }
        })
      }
    }
  };

  if (success) return (
    <div className="mt-2 h5 py-4 success-msg">Successfully Paid!</div>
  )

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      {err && <div className="h6 text-left text-danger">{err}</div>}
      <PaymentElement />
      <button type="submit" className="pay-now mt-2">Pay £{amount}</button>
    </form>
  )
};

const Checkout = ({ method, amount }) => {
  const {id} = useParams()
  const [invoice, setInvoice] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  
  useEffect(() => {
    if (id) {
      api.post('/invoice/get_invoice', {
        params: {
          fe_token: id
        }
      }).then(res => {
        if (res.data.result.data) {
          setInvoice(res.data.result.data.invoice_number)
        }
      })
    }
  }, [id])

  useEffect(() => {
    if (invoice) {
      api.post('/invoice/payment/stripe/create_indent', {
        params: {
          fe_token: id,
          invoice_number: invoice
        }
      }).then(res => {
        if (res.data.result?.result) {
          setClientSecret(res.data.result.result.clientSecret)
        }
      })
    }
  }, [invoice])

  return (
    <>
      {method === 'card' && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} clientSecret={clientSecret} />
        </Elements>
      )}
    </>

  );
};

export default Checkout
