import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import { autocomplete } from 'getaddress-autocomplete'
import { Address, LocationSelectionId } from '@glass/models'
import './location.css'

export type LocationSelectionProps = {
  userBillingAddress: string
  deliveryAddressToParent: (value: string) => void
  ids?: LocationSelectionId[]
  deliveryAddressToChild?: Address
}

export const LocationSelection: React.FC<LocationSelectionProps> = ({
  userBillingAddress,
  deliveryAddressToParent,
  ids,
  deliveryAddressToChild,
}) => {
  const [address, setAddress] = useState('')
  const [addressInput, setAddressInput] = useState(false)
  const customer_id = ids?.[0].customerId
  const address_id = ids?.[0].addressId
  const [deliveryAddress, setDeliveryAddress] = useState('')

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
        if (deliveryAddress === address) {
          newDeliveryAddress('')
          field.removeAttribute('readonly')
          field.focus()
        } else {
          newDeliveryAddress(deliveryAddress)
          field.removeAttribute('readonly')
        }
      }
    }
  }

  const handlePCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    newDeliveryAddress(event.target.value)
  }

  const newDeliveryAddress = (address: string) => {
    deliveryAddressToParent(address)
    setAddress(address)
  }

  const updateDeliveryAddress = (fullAddress: Address) => {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params: {
        customer_id: customer_id,
        address_id: address_id,
        line_1: fullAddress.line_1,
        line_2: fullAddress.line_2,
        postcode: fullAddress.postcode,
        latitude: fullAddress.latitude,
        longitude: fullAddress.longitude,
        town_or_city: fullAddress.town_or_city,
        county: fullAddress.county,
        country: fullAddress.country,
      },
    })
    const config = {
      method: 'post',
      url: process.env.REACT_APP_UPDATE_DELIVERY,
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.REACT_APP_API_KEY,
      },
      data: data,
    }
    axios(config)
      .then(() => {})
      .catch(() => {})
  }

  useEffect(() => {
    // Integration of PostalCode/ Address AutoComplete API
    autocomplete('autocomplete-field', 'SFB4ZD1fO0ONndTgHnmUmg26020', {
      delay: 500,
    })

    // Preventing Default to show complete address with Postal Code
    window.addEventListener('getaddress-autocomplete-address-selected', function (e) {
      e.preventDefault()
      // @ts-ignore
      const address: Address = e.address
      const tempAddress = address.formatted_address.filter(Boolean).join(', ') + ' ' + address.postcode
      newDeliveryAddress(tempAddress)
      updateDeliveryAddress(address)
    })

    // get the width of the main container and set the input bar's width accordingly (the width needs to be hard set in pixels)
    const mainContainer = document.getElementById('loc-container')
    const inputField = document.getElementById('autocomplete-field')
    if (mainContainer != null && inputField) {
      inputField.style.width = (mainContainer.offsetWidth - 60).toString().concat('px')
    }

    newDeliveryAddress(userBillingAddress)

    // format delivery address
    if (deliveryAddressToChild) {
      const deliveryFromAPI =
        deliveryAddressToChild.line_1 +
        ', ' +
        deliveryAddressToChild.line_2 +
        ', ' +
        deliveryAddressToChild.town_or_city +
        ', ' +
        deliveryAddressToChild.county +
        ' ' +
        deliveryAddressToChild.postcode
      setDeliveryAddress(deliveryFromAPI)
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
        defaultValue={address}
        value={address}
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
            defaultChecked
          />
        </div>
      </div>
    </div>
  )
}
