import './location.css'
import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import { ChangeAddress } from '@glass/components/ChangeAddress'
import { AddressType } from '@glass/enums'
import { Address, Quote } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'

export type LocationSelectionProps = {
  qid: string | undefined
  quoteInfo: Quote
  deliveryAddressToParent: (value: Address | undefined) => void
}

export const LocationSelection: React.FC<LocationSelectionProps> = ({ qid, quoteInfo, deliveryAddressToParent }) => {
  const [addressText, setAddressText] = useState<string>(formatAddress(quoteInfo.delivery_address))
  const [addressInput, setAddressInput] = useState<boolean>(
    formatAddress(quoteInfo.invoice_address) !== formatAddress(quoteInfo.delivery_address),
  )

  const handleAddressCheck = () => {
    if (addressInput) {
      setAddressInput(false)
      newDeliveryAddress(quoteInfo.invoice_address)
      const field = document.getElementById('autocomplete-field')
      if (field) field.setAttribute('readonly', '')
    } else {
      setAddressInput(true)
      const field = document.getElementById('autocomplete-field')
      if (field) {
        if (formatAddress(quoteInfo.delivery_address) === addressText) {
          newDeliveryAddress(undefined)
          field.removeAttribute('readonly')
          field.focus()
        } else {
          newDeliveryAddress(quoteInfo.delivery_address)
          field.removeAttribute('readonly')
        }
      }
    }
  }

  const newDeliveryAddress = (address: Address | undefined) => {
    deliveryAddressToParent(address)
    setAddressText(formatAddress(address))
  }

  return (
    <div className='location-container' id='loc-container'>
      <h3 className='text-24 text-blue mb-4 LS-header'>Where do we fix?</h3>
      <div className='option-header'>At home or work</div>

      {addressInput && !!qid && (
        <div className='w-100 d-flex justify-content-end mb-2'>
          <ChangeAddress
            qid={qid}
            customerId={quoteInfo.customer_id}
            addressType={AddressType.DELIVERY}
            initialAddress={quoteInfo.delivery_address}
            onChangeAddress={(event) => {
              newDeliveryAddress(event)
              setAddressText(formatAddress(event))
            }}
          />
        </div>
      )}
      <input type='text' className='address-input' value={addressText || ''} disabled={true} />
      <div className='option-container'>
        <div>
          <span className='shop-address'>Same as billing address</span>
          <Checkbox
            checked={!addressInput}
            onChange={handleAddressCheck}
            sx={{
              color: '#9a73dd',
              '&.Mui-checked': {
                color: '#9a73dd',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
