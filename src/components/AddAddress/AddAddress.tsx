import './style.css'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Modal, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { AddressInput } from '@glass/components/AddressInput'
import { AddressType } from '@glass/enums'
import { Address } from '@glass/models'
import { createAddressService } from '@glass/services/apis/create-address.service'

export type ChangeAddressProps = {
  customerId: number
  addressType: AddressType
  onSuccess: () => void
  onCancel: () => void
}

export const AddAddress: React.FC<ChangeAddressProps> = ({ customerId, addressType, onSuccess, onCancel }) => {
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
      setErrMsg('Please enter post code')
    }
  }

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
          <AddressInput address={fullAddress} formError={!!errMsg} onChange={setFullAddress} />
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
