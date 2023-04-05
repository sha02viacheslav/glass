import React, { useState } from 'react'
import { SelectOfferNew } from '@glass/components/quotePage/SelectOfferNew'
import { Offer } from '@glass/models'
import '../PaymentMethod/payment-method.css'

const previewOffer: Offer[] = [
  {
    product: 'Your order',
    discount: 0,
    price_subtotal: 0,
    price_total: 0,
    price_unit: 0,
  },
]

export const PaymentPreview: React.FC = () => {
  const [singlePay, setSinglePay] = useState('card')
  const [selectedMethod, setSelectedMethod] = useState(4)

  return (
    <div className='payment-method'>
      <h3 className='text-24 text-blue PM-header'>Quotation</h3>
      <div className='PM-status'>Status: processing</div>
      {/* show quotation price details */}
      <SelectOfferNew selectOfferToCustomer={previewOffer} totalPrice={0} totalUnitPrice={0} />
      <div className='PM-btn-container'>
        <button
          className={selectedMethod === 1 ? 'PM-button-active' : 'PM-button'}
          onClick={() => setSelectedMethod(1)}
        >
          <small className='fs-14'>4 month</small>
          <div className='PM-price'>£ 0</div>
        </button>
        <button
          className={selectedMethod === 2 ? 'PM-button-active' : 'PM-button'}
          onClick={() => setSelectedMethod(2)}
        >
          <small className='fs-14'>Insurance</small>
          <div className='PM-price'>£ 0</div>
        </button>
        <button
          className={selectedMethod === 3 ? 'PM-button-active' : 'PM-button'}
          onClick={() => setSelectedMethod(3)}
        >
          <small className='fs-14'>Single pay</small>
          <div className='PM-price'>£ 0</div>
        </button>
      </div>

      <div className='PM-payment-option'>
        {selectedMethod === 1 && (
          <div>
            <p className='text-purple mb-2'>4-Month</p>
            <div>
              <p>This loan comprises of 4 monthly payments, with the first taken immediately on setup.</p>
            </div>
          </div>
        )}
        {selectedMethod === 2 && (
          <div>
            <p className='text-purple mb-2'>Insurance</p>
          </div>
        )}
        {selectedMethod === 3 && (
          <div>
            <p className='text-purple mb-2'>Single pay</p>
            <div className='PM-insurance-container'>
              <div className='PM-single-pay'>
                <button
                  className={singlePay === 'card' ? 'PM-proceed-active' : 'PM-proceed-btn'}
                  onClick={() => setSinglePay('card')}
                >
                  Pay with card
                </button>
                <button
                  className={singlePay === 'cash' ? 'PM-proceed-active' : 'PM-proceed-btn'}
                  onClick={() => setSinglePay('cash')}
                >
                  Pay in cash
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedMethod === 4 && <div className='transparent-element'>-</div>}
      </div>
    </div>
  )
}
