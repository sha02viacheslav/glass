import './location.css'
import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import { autocomplete } from 'getaddress-autocomplete'
import { REACT_APP_AUTOCOMPLETE } from '@glass/envs'
import { Address } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'

export type LocationSelectionProps = {
  userBillingAddress: Address
  deliveryAddressToChild?: Address
  deliveryAddressToParent: (value: Address | undefined) => void
}

export const LocationSelection: React.FC<LocationSelectionProps> = ({
  userBillingAddress,
  deliveryAddressToChild,
  deliveryAddressToParent,
}) => {
  const [address, setAddress] = useState<string>(formatAddress(deliveryAddressToChild))
  const [addressInput, setAddressInput] = useState<boolean>(
    formatAddress(userBillingAddress) !== formatAddress(deliveryAddressToChild),
  )

  const handleAddressCheck = () => {
    if (addressInput) {
      setAddressInput(false)
      newDeliveryAddress(userBillingAddress)
      const field = document.getElementById('autocomplete-field')
      if (field) field.setAttribute('readonly', '')
    } else {
      setAddressInput(true)
      const field = document.getElementById('autocomplete-field')
      if (field) {
        if (formatAddress(deliveryAddressToChild) === address) {
          newDeliveryAddress(undefined)
          field.removeAttribute('readonly')
          field.focus()
        } else {
          newDeliveryAddress(deliveryAddressToChild)
          field.removeAttribute('readonly')
        }
      }
    }
  }

  const handlePCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }

  const newDeliveryAddress = (address: Address | undefined) => {
    deliveryAddressToParent(address)
    setAddress(formatAddress(address))
  }

  useEffect(() => {
    // Integration of PostalCode/ Address AutoComplete API
    autocomplete('autocomplete-field', REACT_APP_AUTOCOMPLETE, {
      delay: 500,
    })

    // Preventing Default to show complete address with Postal Code
    window.addEventListener('getaddress-autocomplete-address-selected', function (e) {
      e.preventDefault()
      // @ts-ignore
      const address: Address = e.address
      newDeliveryAddress(address)
    })

    // get the width of the main container and set the input bar's width accordingly (the width needs to be hard set in pixels)
    const mainContainer = document.getElementById('loc-container')
    const inputField = document.getElementById('autocomplete-field')
    if (mainContainer != null && inputField) {
      inputField.style.width = (mainContainer.offsetWidth - 60).toString().concat('px')
    }
  }, [])

  return (
    <div className='location-container' id='loc-container'>
      <h3 className='text-24 text-blue mb-4 LS-header'>Where do we fix?</h3>
      <div className='option-header'>At home or work</div>
      <input
        id='autocomplete-field'
        type='text'
        className='address-input'
        onChange={handlePCodeChange}
        value={address}
        disabled={!addressInput}
      />
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
