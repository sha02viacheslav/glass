import {Elements, PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import api from '../../api'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const stripePromise = loadStripe('pk_test_ONQ49IuJpAB1k3cyOXCm2aKt007Wg5Nd1E')

const CheckoutForm = ({amount, clientSecret}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState("")
  const [valid, setValid] = useState(false)

  const handleCardChange = (event) => {
    if (event.complete) setValid(true)
    else setValid(false)
  }

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
    <div className="mt-2 h5 py-4 success-msg">
      <svg class="sn-1mj7mtw sn-1njhk9w pay-success" aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.297 13.213.293 8.255c-.39-.394-.39-1.033 0-1.426s1.024-.394 1.414 0l4.294 4.224 8.288-8.258c.39-.393 1.024-.393 1.414 0s.39 1.033 0 1.426L6.7 13.208a.994.994 0 0 1-1.402.005z" fillRule="evenodd"></path>
      </svg>
      <div>Payment success</div>
    </div>
  )

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      {err && <div className="h6 text-left text-danger">{err}</div>}
      <PaymentElement onChange={handleCardChange} />
      <button type="submit" disabled={!valid} className={`pay-now mt-2 ${!valid ? 'invalid' : ''}`}>
        <div className="pay-text">Pay £{amount}</div>
        {!valid && <svg className="sn-1mj7mtw sn-1njhk9w pay-icon" aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
          <path d="M3 7V5a5 5 0 1 1 10 0v2h.5a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1zm5 2.5a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zM11 7V5a3 3 0 1 0-6 0v2z" fillRule="evenodd"></path>
        </svg>}
      </button>
      <div className="terms mt-3">
        Powered by <b>stripe</b> <span style={{ marginLeft: 12, marginRight: 12 }}>|</span>  <a href="https://stripe.com/legal/payment-terms" target="_blank">Terms</a>&nbsp;<a href="https://stripe.com/privacy" target="_blank">Privacy</a>
      </div>
    </form>
  )
};

const Checkout = ({ method, amount }) => {
  const {id} = useParams()
  const [invoice, setInvoice] = useState("")
  const [clientSecret, setClientSecret] = useState("pi_3MqsPMEMBrYgSeOl1X4h7hSi_secret_c2dFk6K60KNtwLpphxl9jZxXZ")
  
  // useEffect(() => {
  //   if (id) {
  //     api.post('/invoice/get_invoice', {
  //       params: {
  //         fe_token: id
  //       }
  //     }).then(res => {
  //       if (res.data.result.data) {
  //         setInvoice(res.data.result.data.invoice_number)
  //       }
  //     })
  //   }
  // }, [id])

  // useEffect(() => {
  //   if (invoice) {
  //     api.post('/invoice/payment/stripe/create_indent', {
  //       params: {
  //         fe_token: id,
  //         invoice_number: invoice
  //       }
  //     }).then(res => {
  //       if (res.data.result?.result) {
  //         setClientSecret(res.data.result.result.clientSecret)
  //       }
  //     })
  //   }
  // }, [invoice])

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
