import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
  Box,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import { Address, ManualAddress, SearchAddress } from '@glass/models'
import { getAddressService } from '@glass/services/apis/get-address.service'
import { searchAddressesService } from '@glass/services/apis/search-addresses.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { CustomAddress } from '../CustomAddress'

export type ChangeAddressProps = {
  address: Address | undefined
  formError: string | boolean | undefined
  disabled?: boolean
  onChange: (value: Address | undefined) => void
}

export const AddressInput: React.FC<ChangeAddressProps> = ({ address, formError, disabled = false, onChange }) => {
  const [manualMode, setManualMode] = useState<boolean>(false)
  const [postcode, setPostcode] = useState<string>(address?.postcode || '')
  const [addressText, setAddressText] = useState<string>(formatAddress(address))
  const [suggestions, setSuggestions] = useState<SearchAddress[]>([])
  const [manualAddress, setManualAddress] = useState<ManualAddress | undefined>(undefined)

  const handlePostcodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const postcode = (event.target.value || '').toUpperCase()
    setPostcode(postcode)
    debouncedChangeHandler(postcode)
    // @ts-ignore
    onChange(undefined)
  }

  const handleAddressChange = (event: SelectChangeEvent) => {
    const addressId = event.target.value as string
    getAddress(addressId)
  }

  const handleManualAddressChange = (value: ManualAddress) => {
    const address: Address = {
      line_1: `${value.street}, ${value.buildingName} ${value.buildingNumber} ${value.flatNumber}`,
      line_2: '',
      line_3: '',
      line_4: '',
      locality: '',
      postcode: postcode,
      latitude: '',
      longitude: '',
      town_or_city: value.city,
      county: value.county,
      district: '',
      country: '',
      formatted_address: [],
    }
    setManualAddress(value)
    setAddressText(formatAddress(address))
    onChange(address)
    setManualMode(false)
    toast('Custom address is added')
  }

  const searchAddresses = (postcode: string) => {
    searchAddressesService(postcode).then((res) => {
      if (res.success) {
        setSuggestions(res.data.suggestions)
      }
    })
  }

  const getAddress = (addressId: string) => {
    getAddressService(addressId).then((res) => {
      if (res.success) {
        const address = res.data
        setAddressText(formatAddress(address))
        setPostcode(address.postcode)
        onChange(address)
      }
    })
  }

  const debouncedChangeHandler = useCallback(debounce(searchAddresses, 1000), [])

  useEffect(() => {
    if (address) {
      setPostcode(address.postcode)
      searchAddresses(address.postcode)
      setAddressText(formatAddress(address))
    }
  }, [address])

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <FormControl sx={{ width: '140px' }}>
          <InputLabel id='postcode-input'>Postcode</InputLabel>
          <OutlinedInput
            id='postcode-input'
            value={postcode}
            label='Postcode'
            placeholder='Enter Postcode'
            onChange={handlePostcodeChange}
            disabled={disabled}
            error={!suggestions?.length && !!formError}
          />
          <small className='form-error'>{!suggestions?.length && formError}</small>
        </FormControl>

        <FormControl sx={{ flex: '1' }} disabled={!suggestions?.length}>
          <InputLabel id='address-select'>Address</InputLabel>
          <Select
            id='address-select'
            label='Address'
            placeholder='Select Address'
            onChange={handleAddressChange}
            error={!!suggestions?.length && !!formError}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: 'var(--4, 4px) var(--16, 16px) var(--12, 12px) var(--16, 16px)',
                gap: '10px',
                borderBottom: '1px solid var(--Gray-200, #eaeaeb)',
                color: 'var(--Gray-600, #6a6b71)',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: 'normal',
                letterSpacing: '-0.14px',
              }}
            >
              <img src={process.env.PUBLIC_URL + '/images/information.svg'} className='img-fluid' alt='' />
              <div>Please pick your exact address from the list below or edit manually at the bottom</div>
            </Box>
            {suggestions.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.address}
              </MenuItem>
            ))}
            <Box
              sx={{
                display: 'flex',
                padding: '12px 24px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'stretch',
                borderRadius: '2px',
                background: 'var(--Light-Blue---Primary-000, #e8f0fe)',
                color: 'var(--Light-Blue---Primary-500, #225fc2)',
                fontSize: '18px',
                fontWeight: '700',
                lineHeight: '24px',
                letterSpacing: '-0.18px',
                cursor: 'pointer',
              }}
              onClick={() => setManualMode(true)}
            >
              Enter address manually
            </Box>
          </Select>
          <small className='form-error'>{!!suggestions?.length && formError}</small>
        </FormControl>
      </Box>

      {!!addressText && (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            color: 'var(--Gray-600, #6a6b71)',
            fontSize: { xs: 15, lg: 16 },
            fontWeight: '400',
            lineHeight: { xs: '140%', lg: '150%' },
            letterSpacing: '-0.14px',
            marginTop: '4px',
          }}
        >
          <CardMedia
            component='img'
            sx={{ width: { xs: 16, lg: 24 }, height: { xs: 16, lg: 24 }, mt: { xs: '2px', lg: 0 } }}
            image={process.env.PUBLIC_URL + '/images/map-marker-light.svg'}
          />
          {addressText}
        </Box>
      )}

      {manualMode && (
        <CustomAddress
          address={manualAddress}
          postcode={postcode}
          onSuccess={(val) => {
            handleManualAddressChange(val)
          }}
          onClose={() => {
            setManualMode(false)
          }}
        />
      )}
    </Box>
  )
}
