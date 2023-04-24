import './style.css'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Modal, Typography } from '@mui/material'
import { autocomplete } from 'getaddress-autocomplete'
import { trackPromise } from 'react-promise-tracker'
import { AddressType } from '@glass/enums'
import { REACT_APP_AUTOCOMPLETE } from '@glass/envs'
import { Address } from '@glass/models'
import { createAddressService } from '@glass/services/apis/create-address.service'

export type ChangeAddressProps = {
  customerId: number
  addressType: AddressType
  onSuccess: () => void
  onCancel: () => void
}

export const AddAddress: React.FC<ChangeAddressProps> = ({ customerId, addressType, onSuccess, onCancel }) => {
  const addressRef = useRef<HTMLInputElement>(null)
  const [addressVal, setAddressVal] = useState<string>('')
  const [fullAddress, setFullAddress] = useState<Address | undefined>(undefined)
  const [errMsg, setErrMsg] = useState<string>('')

  const handleCreateAddress = () => {
    if (fullAddress) {
      trackPromise(
        createAddressService(customerId, addressType, fullAddress).then((res) => {
          if (res.success) {
            onSuccess()
          }
        }),
      )
    } else {
      setErrMsg('Please select the correct address from the auto complete')
    }
  }

  const handlePCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddressVal(event.target.value)
  }

  useEffect(() => {
    console.warn(document.querySelector('#addressModalInput'))
    setTimeout(() => {
      autocomplete('addressModalInput', REACT_APP_AUTOCOMPLETE, {
        delay: 500,
      })
    })

    // Preventing Default to show complete address with Postal Code
    window.addEventListener('getaddress-autocomplete-address-selected', function (e) {
      e.preventDefault()
      // @ts-ignore
      const address: Address = e.address
      setFullAddress(address)
      const tempAddress = address.formatted_address.filter(Boolean).join(', ') + ' ' + address.postcode
      setAddressVal(tempAddress)
    })
  }, [])

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: 'auto',
          backgroundColor: '#EEF4F8',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          maxWidth: '760px',
          p: 4,
        }}
      >
        <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
          <CloseIcon className='closeBtn' onClick={() => onCancel()} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={'bold'}>
            Add {addressType === AddressType.INVOICE ? 'Billing' : 'Fixing'} address
          </Typography>
        </Box>

        <Box marginTop={4}>
          <input
            id='addressModalInput'
            ref={addressRef}
            type='text'
            placeholder={addressType == AddressType.INVOICE ? 'Billing address' : 'Fixing address'}
            className={'form-control'}
            onChange={handlePCodeChange}
            value={addressVal}
          />
          {!!errMsg && (
            <Box className='formError' marginTop={1}>
              {errMsg}
            </Box>
          )}

          <Box marginTop={4} display='flex' alignItems='center' justifyContent='center' gap={4}>
            <button className='btn-stroked' onClick={() => onCancel()}>
              Cancel
            </button>
            <button className='btn-raised' onClick={() => handleCreateAddress()}>
              Save Address
            </button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
