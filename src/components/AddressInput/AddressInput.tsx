import './AddressInput.css'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { autocomplete } from 'getaddress-autocomplete'
import { REACT_APP_AUTOCOMPLETE } from '@glass/envs'
import { Address } from '@glass/models'
import { formatAddress } from '@glass/utils/format-address/format-address.util'

export type ChangeAddressProps = {
  address: Address | undefined
  formError: boolean
  disabled?: boolean
  onChange: (value: Address | undefined) => void
}

export const AddressInput: React.FC<ChangeAddressProps> = ({ address, formError, disabled = false, onChange }) => {
  const uniqueId = useMemo(() => {
    return `address-input-${parseInt((Math.random() * 1000).toString())}`
  }, [])
  const addressRef = useRef<HTMLInputElement>(null)
  const [addressText, setAddressText] = useState<string>(formatAddress(address))

  const handlePCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = (event.target.value || '').toUpperCase()
    setAddressText(inputValue)
    // @ts-ignore
    onChange(undefined)
  }

  useEffect(() => {
    if (uniqueId) {
      setTimeout(() => {
        autocomplete(uniqueId, REACT_APP_AUTOCOMPLETE, {
          delay: 500,
        })
      })

      // Preventing Default to show complete address with Postal Code
      window.addEventListener('getaddress-autocomplete-address-selected', function (e) {
        e.preventDefault()
        // @ts-ignore
        const address: Address = e.address
        setAddressText(formatAddress(address))
        onChange(address)
      })
    }
  }, [uniqueId])

  useEffect(() => {
    setAddressText(formatAddress(address))
  }, [address])

  return (
    <Box>
      <input
        id={uniqueId}
        ref={addressRef}
        type='text'
        placeholder='Please enter postcode and select your address'
        className={formError ? 'form-control round form-not-filled' : 'form-control round'}
        onChange={handlePCodeChange}
        value={addressText}
        disabled={disabled}
      />
    </Box>
  )
}
