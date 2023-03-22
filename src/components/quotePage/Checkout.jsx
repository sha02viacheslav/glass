import {Elements, useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios';
import { useRef, useState } from 'react';
import Slider from "react-slick";
import '../../css/checkout.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({amount}) => {
  const cardRef = useRef(null);
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    cvc: '',
    exp_month: '',
    exp_year: ''
  });

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      alert("payment failed: " + error.message)
      return
    }

    const res = await axios.post('http://localhost:3001/stripe/checkout', {
      paymentMethod: paymentMethod.id,
      cardDetails,
      amount
    })

    // 3d secuire verification
    if (res.data.actionRequired) {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        res.data.clientSecret
      );
      if (error) return alert("Error in payment, please try again later");
      if (paymentIntent.status === "succeeded") {
        return alert(`Payment successful, payment ID - ${res.data.id}`);
      }
    }

    alert(`Payment successful, payment ID - ${res.data.id}`);
  };

  const handleCardChange = (event) => {
    setCardDetails({
      number: cardRef.current?.getElement('cardNumber').value,
      cvc: cardRef.current?.getElement('cardCvc').value,
      exp_month: cardRef.current?.getElement('cardExpiry')._privateCardExpiry.month,
      exp_year: cardRef.current?.getElement('cardExpiry')._privateCardExpiry.year
    });
  };

  return (
    <form onSubmit={handleSubmit} className="PM-header">
      <Slider dots={false} infinite={true} speed={500} autoplay={true} slidesToShow={6} slidesToScroll={1} arrows={false}>
        <div><img className="img-responsive images" src="/img/brands/visa.png" alt="visa" style={{ border: '1px solid gray' }} /></div>
        <div><img className="img-responsive images" src="/img/brands/maestro.png" alt="maestro" /></div>
        <div><img className="img-responsive images" src="/img/brands/mastercard.png" alt="mastercard" /></div>
        <div><img className="img-responsive images" src="/img/brands/discover.png" alt="discover-card" /></div>
        <div><img className="img-responsive images" src="/img/brands/ae.png" alt="american-express" /></div>
        <div><img className="img-responsive images" src="/img/brands/dc.png" alt="dc" /></div>
        <div><img className="img-responsive images" src="/img/brands/jcb.svg" alt="jcb" /></div>
        <div><img className="img-responsive images" src="/img/brands/UnionPay.png" alt="UnionPay" /></div>
        <div><img className="img-responsive images" src="/img/brands/cb.jpg" alt="cb" /></div>
        <div><img className="img-responsive images" src="/img/brands/dankort.png" alt="dankort" /></div>
        <div><img className="img-responsive images" src="/img/brands/interac.png" alt="interac" /></div>
        <div><img className="img-responsive images" src="/img/brands/rupay.png" alt="rupay" style={{ border: '1px solid gray' }} /></div>
      </Slider>
      <div className="form-control" style={{ height: 48, paddingTop: 14 }}>
        <CardElement ref={cardRef} onChange={handleCardChange} options={{ style: { base: { fontSize: '15px' } }}} />
      </div>
      <div className="row mt-3">
        <div className="form-group">
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" placeholder="Card Owner Name" style={{ height: 48 }} required />
        </div>
      </div>
      <button disabled={!stripe} className="PM-proceed-active">Submit</button>
    </form>
  )
};

const Checkout = ({ method, amount }) => {
  // const [clientSecret, setClientSecret] = useState("")

  // useEffect(() => {
  //   if (method === 'card' && !clientSecret) {
  //     console.log(method)
  //     axios.post('http://localhost:3001/stripe/payment-intent', {}).then(res => {
  //       console.log(res.data)
  //       if (res.data.success) {
  //         setClientSecret(res.data.client_secret)
  //       }
  //     })
  //   }
  // }, [method])

  return (
    <>
      {method === 'card' && (
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} />
        </Elements>
      )}
    </>

  );
};

export default Checkout