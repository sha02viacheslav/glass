import './CustomAddress.css'
import React from 'react'
import { FormControl, InputLabel, Modal, OutlinedInput } from '@mui/material'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { ManualAddress } from '@glass/models'

export type CustomAddressProps = {
  address?: ManualAddress
  postcode: string
  onSuccess: (value: ManualAddress) => void
  onClose: () => void
}

export type CustomAddressForm = {
  flatNumber: string
  buildingNumber: string
  buildingName: string
  street: string
  city: string
  county: string
}

export enum CustomAddressFormFieldIds {
  FLAT_NUMBER = 'flatNumber',
  BUILDING_NUMBER = 'buildingNumber',
  BUILDING_NAME = 'buildingName',
  STREET = 'street',
  CITY = 'city',
  COUNTY = 'county',
}

export const CustomAddress: React.FC<CustomAddressProps> = ({
  address = {
    flatNumber: '',
    buildingNumber: '',
    buildingName: '',
    street: '',
    city: '',
    county: '',
  },
  postcode,
  onSuccess,
  onClose,
}) => {
  const validationSchema = object({
    flatNumber: string().required('Required').nullable(),
    buildingNumber: string().required('Required').nullable(),
    buildingName: string().required('Required').nullable(),
    street: string().required('Required').nullable(),
    city: string().required('Required').nullable(),
    county: string().required('Required').nullable(),
  })

  const formik = useFormik({
    initialValues: address,
    validationSchema: validationSchema,
    onSubmit: async () => {
      onSuccess(formik.values)
    },
  })

  const handleCreateAddress = () => {
    formik.handleSubmit()
  }

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <div className='custom-address-dialog'>
        <div className='custom-address-modal-header'>
          <img
            src={process.env.PUBLIC_URL + '/images/close.svg'}
            className='close-btn'
            alt=''
            onClick={() => onClose()}
          />
          <div className='title'>Random address</div>
          <div className='description'>
            If your address is not in the list you can enter it here manually and we will find you.
          </div>
          <div className='postcode'>
            <span className='gray'>Postcode:</span> {postcode}
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className='row mt-4'>
            <div className='col-6 mb-4'>
              <FormControl fullWidth>
                <InputLabel>Flat number</InputLabel>
                <OutlinedInput
                  label='Flat number'
                  placeholder='Flat number'
                  value={formik.values.flatNumber}
                  onChange={(e) => formik.setFieldValue(CustomAddressFormFieldIds.FLAT_NUMBER, e.target.value)}
                  error={formik.touched.flatNumber && !!formik.errors.flatNumber}
                />
                <small className='form-error'>{formik.touched.flatNumber && formik.errors.flatNumber}</small>
              </FormControl>
            </div>

            <div className='col-6 mb-4'>
              <FormControl fullWidth>
                <InputLabel>Building number</InputLabel>
                <OutlinedInput
                  label='Building number'
                  placeholder='Building number'
                  value={formik.values.buildingNumber}
                  onChange={(e) => formik.setFieldValue(CustomAddressFormFieldIds.BUILDING_NUMBER, e.target.value)}
                  error={formik.touched.flatNumber && !!formik.errors.buildingNumber}
                />
                <small className='form-error'>{formik.touched.buildingNumber && formik.errors.buildingNumber}</small>
              </FormControl>
            </div>

            <div className='col-12 mb-4'>
              <FormControl fullWidth>
                <InputLabel>Building name</InputLabel>
                <OutlinedInput
                  label='Building name'
                  placeholder='Building name'
                  value={formik.values.buildingName}
                  onChange={(e) => formik.setFieldValue(CustomAddressFormFieldIds.BUILDING_NAME, e.target.value)}
                  error={formik.touched.flatNumber && !!formik.errors.buildingName}
                />
                <small className='form-error'>{formik.touched.buildingName && formik.errors.buildingName}</small>
              </FormControl>
            </div>

            <div className='col-12 mb-4'>
              <FormControl fullWidth>
                <InputLabel>Street name</InputLabel>
                <OutlinedInput
                  label='Street name'
                  placeholder='Street name'
                  value={formik.values.street}
                  onChange={(e) => formik.setFieldValue(CustomAddressFormFieldIds.STREET, e.target.value)}
                  error={formik.touched.flatNumber && !!formik.errors.street}
                />
                <small className='form-error'>{formik.touched.street && formik.errors.street}</small>
              </FormControl>
            </div>

            <div className='col-12 mb-4'>
              <FormControl fullWidth>
                <InputLabel>Town</InputLabel>
                <OutlinedInput
                  label='Town'
                  placeholder='Town'
                  value={formik.values.city}
                  onChange={(e) => formik.setFieldValue(CustomAddressFormFieldIds.CITY, e.target.value)}
                  error={formik.touched.flatNumber && !!formik.errors.city}
                />
                <small className='form-error'>{formik.touched.city && formik.errors.city}</small>
              </FormControl>
            </div>

            <div className='col-12 mb-4'>
              <FormControl fullWidth>
                <InputLabel>County/Shire</InputLabel>
                <OutlinedInput
                  label='County/Shire'
                  placeholder='County/Shire'
                  value={formik.values.county}
                  onChange={(e) => formik.setFieldValue(CustomAddressFormFieldIds.COUNTY, e.target.value)}
                  error={formik.touched.flatNumber && !!formik.errors.county}
                />
                <small className='form-error'>{formik.touched.county && formik.errors.county}</small>
              </FormControl>
            </div>
          </div>
        </form>

        <div className='custom-address-modal-footer'>
          <div className='full-address'>
            <div>{formik.values.flatNumber}</div>
            <div>{formik.values.buildingNumber}</div>
            <div>{formik.values.buildingName}</div>
            <div>{formik.values.street}</div>
            <div>{formik.values.city}</div>
            <div>{formik.values.county}</div>
          </div>
          <button type='button' className='btn-raised' onClick={() => handleCreateAddress()}>
            Add my address
          </button>
        </div>
      </div>
    </Modal>
  )
}
