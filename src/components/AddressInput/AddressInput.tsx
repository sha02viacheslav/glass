import './AddressInput.css'
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
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
  const [fullAddress, setFullAddress] = useState<Address | undefined>(address || undefined)

  const handlePCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const postCode = (event.target.value || '').toUpperCase()
    // @ts-ignore
    const address: Address = { postcode: postCode }
    setFullAddress(address)
    onChange(address)
  }

  const handleHouseNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const houseNumber = event.target.value || ''
    // @ts-ignore
    const address: Address = { postcode: fullAddress?.postcode || '', line_1: houseNumber }
    setFullAddress(address)
    onChange(address)
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
        setFullAddress(address)
        onChange(address)
      })
    }
  }, [uniqueId])

  useEffect(() => {
    setFullAddress(address)
    onChange(address)
  }, [address])

  return (
    <Box>
      <Box className='row'>
        <Box className='col-md-6'>
          <input
            id={uniqueId}
            ref={addressRef}
            type='text'
            placeholder='Post Code'
            className={formError ? 'form-control form-not-filled' : 'form-control'}
            onChange={handlePCodeChange}
            value={fullAddress?.postcode || ''}
            disabled={disabled}
          />
        </Box>
        <Box className='col-md-6'>
          <input
            type='text'
            placeholder='House Number'
            className={'form-control'}
            value={fullAddress?.line_1 || ''}
            onChange={handleHouseNumberChange}
            disabled={disabled}
          />
        </Box>
      </Box>
      <Typography className='text-left mt-2' sx={{ fontSize: '14px' }}>
        <strong>Full Address:</strong> {formatAddress(fullAddress)}
      </Typography>
    </Box>
  )
}
