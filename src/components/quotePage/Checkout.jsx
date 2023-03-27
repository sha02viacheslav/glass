import { useRef, useState } from 'react'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import '../../css/checkout.css'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe()

  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const cardNumberRef = useRef(null)

  const handleCardNumberChange = (event) => {
    let value = event.target.value
    value = value.replace(/\s/g, '')
    let formattedValue = ''
    for (let i = 0; i < value.length; i++) {
      if (i % 4 === 0 && i > 0) {
        formattedValue += ' '
      }
      formattedValue += value[i]
    }
    setCardNumber(formattedValue)
  }

  function handleExpiryChange(event) {
    const input = event.target.value
    const formattedInput = input
      .replace(/\D/g, '') // Remove all non-digits
      .slice(0, 4) // Limit to 4 characters
      .replace(/(\d{2})(\d{0,2})/, '$1 / $2') // Add space after 2 digits

    setExpiryDate(formattedInput)

    if (!/^\d{2} \/ \d{2}$/.test(formattedInput)) {
      event.target.setCustomValidity('Please enter a valid expiry date (MM / YY)')
    } else {
      event.target.setCustomValidity('')
    }
  }

  const handleCvcChange = (event) => {
    setCvc(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: Handle payment submission

    const [exp_month, exp_year] = expiryDate.split('/').map((v) => parseInt(v))
    if (isNaN(exp_month) || isNaN(exp_year)) return

    setErrors({})
    axios
      .post('http://localhost:3001/stripe/checkout', { cardNumber, exp_month, exp_year, cvc, amount })
      .then(async ({ data }) => {
        if (!data.success) {
          if (data.message?.type == 'card_error') {
            setErrors({ [data.message.code]: data.message.message })
          } else {
            setErrors({ processing_error: 'Error in payment, please try again later' })
          }
        } else {
          // let paymentId = data.id
          if (data.actionRequired) {
            const { paymentIntent, error } = await stripe.confirmCardPayment(data.clientSecret)
            if (error) {
              setErrors({ processing_error: 'Error in payment, please try again later' })
              return
            }
            if (paymentIntent.status === 'succeeded') {
              // paymentId = data.id
            }
          }
          setSuccess(true)
        }
      })
  }

  const handleCardNumberFocus = () => {
    cardNumberRef.current.classList.add('focused')
  }

  const handleCardNumberBlur = () => {
    cardNumberRef.current.classList.remove('focused')
  }

  if (success) return <div className='mt-2 h5 py-4 success-msg'>Successfully Paid!</div>

  return (
    <form className='payment-form mt-2' onSubmit={handleSubmit}>
      <div className='form-row'>
        <label htmlFor='card-number'>Card number</label>
        <div
          id='card-number'
          className='card-number-input position-relative'
          ref={cardNumberRef}
          onFocus={handleCardNumberFocus}
          onBlur={handleCardNumberBlur}
        >
          <input
            type='tel'
            inputMode='numeric'
            pattern='[0-9\s]{13,19}'
            autoComplete='cc-number'
            maxLength='19'
            placeholder='1234 1234 1234 1234'
            value={cardNumber}
            onChange={handleCardNumberChange}
            className='form-control'
            required
          />
          <div className='p-CardCvcIcons'>
            <svg
              className='p-CardCvcIcons-svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              fill='#6d6e78'
              role='presentation'
            >
              <path
                opacity='.4'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15.337 4A5.5 5.5 0 1023 11.663V18a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h12.337zm6.707.293c.239.202.46.424.662.663a2.01 2.01 0 00-.662-.663zM3 9a1 1 0 011-1h5a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V9z'
              ></path>
              <path
                opacity='.6'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M4 15a1 1 0 100 2h1.5a1 1 0 100-2H4zm4.8 0a1 1 0 100 2h1.5a1 1 0 100-2H8.8zm3.8 1a1 1 0 011-1h1.5a1 1 0 110 2h-1.5a1 1 0 01-1-1zm5.9-1a1 1 0 100 2H20a1 1 0 100-2h-1.5z'
              ></path>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M18.5 14a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-1.719a1.031 1.031 0 100-2.062 1.031 1.031 0 000 2.062zm0-7.906a.687.687 0 00-.688.688V8.5a.687.687 0 101.375 0V5.062a.687.687 0 00-.687-.687z'
              ></path>
            </svg>
          </div>
        </div>
        {(errors.incorrect_number || errors.card_declined) && (
          <div className='text-danger h6 text-left mt-1'>{errors.incorrect_number || errors.card_declined}</div>
        )}
      </div>

      <div className='form-row d-flex justify-content-between gap-3'>
        <div className='w-100'>
          <label htmlFor='expiry-date'>Expiration</label>
          <input
            type='text'
            autoComplete='cc-exp'
            placeholder='MM / YY'
            value={expiryDate}
            onChange={handleExpiryChange}
            className='form-control'
            required
          />
          {errors.expired_card && <div className='text-danger h6 text-left mt-1'>{errors.expired_card}</div>}
        </div>
        <div className='w-100'>
          <label htmlFor='cvc'>CVC</label>
          <div className='position-relative'>
            <input
              type='tel'
              inputMode='numeric'
              pattern='[0-9]{3,4}'
              autoComplete='cc-csc'
              maxLength='4'
              placeholder='CVC'
              value={cvc}
              onChange={handleCvcChange}
              className='form-control'
              style={{ paddingRight: '51.2px' }}
              required
            />
            <div className='p-CardCvcIcons'>
              <svg
                className='p-CardCvcIcons-svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                fill='#6d6e78'
                role='img'
                aria-labelledby='cvcDesc'
              >
                <path
                  opacity='.2'
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M15.337 4A5.493 5.493 0 0013 8.5c0 1.33.472 2.55 1.257 3.5H4a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1v-.6a5.526 5.526 0 002-1.737V18a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h12.337zm6.707.293c.239.202.46.424.662.663a2.01 2.01 0 00-.662-.663z'
                ></path>
                <path
                  opacity='.4'
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M13.6 6a5.477 5.477 0 00-.578 3H1V6h12.6z'
                ></path>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M18.5 14a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm-2.184-7.779h-.621l-1.516.77v.786l1.202-.628v3.63h.943V6.22h-.008zm1.807.629c.448 0 .762.251.762.613 0 .393-.37.668-.904.668h-.235v.668h.283c.565 0 .95.282.95.691 0 .393-.377.66-.911.66-.393 0-.786-.126-1.194-.37v.786c.44.189.88.291 1.312.291 1.029 0 1.736-.526 1.736-1.288 0-.535-.33-.967-.88-1.14.472-.157.778-.573.778-1.045 0-.738-.652-1.241-1.595-1.241a3.143 3.143 0 00-1.234.267v.77c.378-.212.763-.33 1.132-.33zm3.394 1.713c.574 0 .974.338.974.778 0 .463-.4.785-.974.785-.346 0-.707-.11-1.076-.337v.809c.385.173.778.26 1.163.26.204 0 .392-.032.573-.08a4.313 4.313 0 00.644-2.262l-.015-.33a1.807 1.807 0 00-.967-.252 3 3 0 00-.448.032V6.944h1.132a4.423 4.423 0 00-.362-.723h-1.587v2.475a3.9 3.9 0 01.943-.133z'
                ></path>
              </svg>
            </div>
          </div>
          {errors.incorrect_cvc && <div className='text-danger h6 text-left mt-1'>{errors.incorrect_cvc}</div>}
        </div>
      </div>
      {errors.processing_error && <div className='text-danger h6 text-left mt-1'>{errors.processing_error}</div>}
      <button type='submit' className='pay-now'>
        Pay £{amount}
      </button>
    </form>
  )
}

const Checkout = ({ method, amount }) => {
  return (
    <>
      {method === 'card' && (
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} />
        </Elements>
      )}
    </>
  )
}

export default Checkout
