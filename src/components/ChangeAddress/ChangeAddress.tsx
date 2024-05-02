import './style.css'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import { Box, Checkbox, Modal, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { AddAddress } from '@glass/components/AddAddress'
import { AddressType } from '@glass/enums'
import { Address } from '@glass/models'
import { deleteAddressService } from '@glass/services/apis/delete-address.service'
import { getAddressesService } from '@glass/services/apis/get-addresses.service'
import { updateQuoteAddressService } from '@glass/services/apis/update-quote-address.service'

export type ChangeAddressProps = {
  qid: string
  customerId: number
  addressType: AddressType
  initialAddress: Address
  onChangeAddress: (value: Address) => void
}

export const ChangeAddress: React.FC<ChangeAddressProps> = ({
  qid,
  customerId,
  addressType,
  initialAddress,
  onChangeAddress,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address>(initialAddress)
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false)

  const handleStartEdit = () => {
    setIsOpen(true)
  }

  const getAddresses = () => {
    trackPromise(
      getAddressesService(customerId, addressType).then((res) => {
        if (res.success) {
          setAddresses(res.data)
        }
      }),
    )
  }

  const handleAddressCheck = (address: Address) => {
    setSelectedAddress(address)
  }

  const handleDeleteAddress = (address: Address) => {
    if (address.address_id) {
      trackPromise(
        deleteAddressService(customerId, addressType, address.address_id).then((res) => {
          if (res.success) {
            getAddresses()
          }
        }),
      )
    }
  }

  const handleChangeAddress = () => {
    if (selectedAddress.address_id) {
      trackPromise(
        updateQuoteAddressService(qid, addressType, selectedAddress.address_id).then((res) => {
          if (res.success) {
            onChangeAddress(selectedAddress)
            setIsOpen(false)
          }
        }),
      )
    }
  }

  useEffect(() => {
    getAddresses()
  }, [customerId])

  return (
    <>
      <button
        className='text-btn'
        type='button'
        onClick={() => {
          handleStartEdit()
        }}
      >
        Change
      </button>
      {isOpen && (
        <Modal
          open={isOpen}
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
              maxWidth: '550px',
              p: 4,
            }}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
              <CloseIcon className='closeBtn' onClick={() => setIsOpen(false)} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h5' fontWeight={'bold'}>
                {addressType === AddressType.INVOICE ? 'Billing' : 'Fixing'} address
              </Typography>
            </Box>
            <Box marginTop={4}>
              {addresses.map((address, index) => (
                <Box key={index} display='flex' alignItems='center' justifyContent='space-between'>
                  <Box display='flex' alignItems='center'>
                    <Checkbox
                      checked={selectedAddress.address_id === address.address_id}
                      onChange={() => handleAddressCheck(address)}
                      sx={{
                        color: '#9a73dd',
                        '&.Mui-checked': { color: '#9a73dd' },
                      }}
                    />
                    {address.line_1}, {address.town_or_city}, {address.postcode}
                  </Box>
                  {addresses.length > 1 && (
                    <button className='btn-icon' onClick={() => handleDeleteAddress(address)}>
                      <DeleteForeverOutlinedIcon />
                    </button>
                  )}
                </Box>
              ))}
            </Box>

            {!showAddressForm ? (
              <Box marginTop={4} display='flex' justifyContent='end'>
                <button className='text-btn' onClick={() => setShowAddressForm(true)}>
                  Add New Address
                </button>
              </Box>
            ) : (
              <AddAddress
                customerId={customerId}
                addressType={addressType}
                onSuccess={() => {
                  getAddresses()
                  setShowAddressForm(false)
                }}
                onCancel={() => {
                  setShowAddressForm(false)
                }}
              />
            )}

            <Box marginTop={4} display='flex' alignItems='center' justifyContent='center' gap={4}>
              <button className='btn-stroked' type='button' onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button
                className='btn-raised'
                type='button'
                onClick={() => {
                  handleChangeAddress()
                }}
              >
                Save Address
              </button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  )
}
