import './Customer.css'
import React, { useEffect, useState } from 'react'
import { FormControl, FormControlLabel, OutlinedInput, Radio, RadioGroup } from '@mui/material'
import { useFormik } from 'formik'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { array, object, string } from 'yup'
import { AddPictures } from '@glass/components/AddPictures'
import { AddressInput } from '@glass/components/AddressInput/AddressInput'
import { ChangeAddress } from '@glass/components/ChangeAddress'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { WindowSelector } from '@glass/components/WindowSelector'
import { AddressType, BeforeAfterType, CarType, WorkingPlace } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Address, Attachment, BeforeAfter, Comment, Quote, QuoteDto, VehicleData } from '@glass/models'
import { beforeAfterService } from '@glass/services/apis/before-after.service'
import { createQuoteService } from '@glass/services/apis/create-quote.service'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { getVehicleService } from '@glass/services/apis/get-vehicle.service'
import { updateQuoteService } from '@glass/services/apis/update-quote.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import { scrollToElementWithOffset } from '@glass/utils/index'
import { clearRequestedURL, getRequestedURL } from '@glass/utils/session/session.util'

export type CustomerForm = {
  registrationNumber: string
  glassLocation: string[]
  firstName: string
  lastName: string
  email: string
  phone: string
  invoiceAddress: string
}

export enum FormFieldIds {
  REGISTRATION_NUMBER = 'registrationNumber',
  GLASS_LOCATION = 'glassLocation',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PHONE = 'phone',
  INVOICE_ADDRESS = 'invoiceAddress',
}

export type CustomerProps = {
  editMode?: boolean
}

export const Customer: React.FC<CustomerProps> = ({ editMode = false }) => {
  const navigate = useNavigate()

  const { licenseNum, quoteId } = useParams()

  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [licenseSearchVal, setLicense] = useState(licenseNum || '')
  const [vehData, setVehData] = useState<VehicleData | undefined>()
  const [billingAddress, setBillingAddress] = useState<Address | undefined>(undefined)
  const [fixingAddressText, setFixingAddressText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfter[]>([])
  const [workingPlace, setWorkingPlace] = useState<WorkingPlace>(WorkingPlace.MOBILE)

  const validationSchema = object({
    registrationNumber: string()
      .required('Invalid vehicle registration number. Please review and correct it.')
      .nullable(),
    glassLocation: array().of(string()).required().min(1, 'Select windows that need replacing'),
    firstName: string().required('Required').nullable(),
    lastName: string().required('Required').nullable(),
    email: string().email('Invalid email').required('Required').nullable(),
    phone: string().required('Required').nullable(),
    invoiceAddress: string().required('Required').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      registrationNumber: licenseNum || '',
      glassLocation: [],
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      invoiceAddress: '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      if (submit) {
        submit(formik.values)
      }
    },
  })

  const [comment, setComment] = useState<string>('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  // temporary things for car selection menu - Rainer
  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)

  // for getting the array of broken windows
  const [selectedBrokenWindows, setSelectedBrokenWindows] = useState<string[]>([])

  // preselect broken windows if editing quote
  const [brokenWindowsToComponent, setBrokenWindowsToComponent] = useState<string[]>([])

  const brokenWindowsToCustomer = (windows: string[]) => {
    setSelectedBrokenWindows(windows)
    formik.setFieldValue(
      FormFieldIds.GLASS_LOCATION,
      (selectedBrokenWindows || []).map((item) => item.toLowerCase()),
    )
  }

  const getQuote = () => {
    if (quoteId) {
      trackPromise(
        getQuoteService(quoteId, false).then((res) => {
          if (res.success) {
            setQuoteDetails(res.data)
          }
        }),
      )
    }
  }

  const retrieveVehData = (data: CarType) => {
    setSelectedCarType(data)
  }

  useRetrieveVehData(vehData, retrieveVehData)

  function handleSubmitClick() {
    formik.handleSubmit()
    if (formik.errors.registrationNumber) {
      scrollToElementWithOffset(FormFieldIds.REGISTRATION_NUMBER, 100)
    } else if (formik.errors.glassLocation) {
      scrollToElementWithOffset(FormFieldIds.GLASS_LOCATION, 100)
    } else if (formik.errors.firstName) {
      scrollToElementWithOffset(FormFieldIds.FIRST_NAME, 100)
    } else if (formik.errors.lastName) {
      scrollToElementWithOffset(FormFieldIds.LAST_NAME, 100)
    } else if (formik.errors.email) {
      scrollToElementWithOffset(FormFieldIds.EMAIL, 100)
    } else if (formik.errors.phone) {
      scrollToElementWithOffset(FormFieldIds.PHONE, 100)
    } else if (formik.errors.invoiceAddress) {
      scrollToElementWithOffset(FormFieldIds.INVOICE_ADDRESS, 100)
    }
  }

  const submit = (values: CustomerForm) => {
    // post data
    const firstName = (values.firstName || '').trim()
    const lastName = (values.lastName || '').trim()
    const fullName = `${firstName} ${lastName}`

    const postData: QuoteDto = {
      customer_name: fullName,
      customer_f_name: firstName,
      customer_s_name: lastName,
      customer_phone: (values.phone || '').trim(),
      customer_email: (values.email || '').trim(),
      customer_address: {
        postcode: billingAddress?.postcode || '',
        latitude: billingAddress?.latitude || '',
        longitude: billingAddress?.longitude || '',
        line_1: billingAddress?.line_1 || '',
        line_2: billingAddress?.line_2 || '',
        line_3: billingAddress?.line_3 || '',
        line_4: billingAddress?.line_4 || '',
        locality: billingAddress?.locality || '',
        town_or_city: billingAddress?.town_or_city || '',
        county: billingAddress?.county || '',
        district: billingAddress?.district || '',
        country: billingAddress?.country || '',
      },
      registration_number: values.registrationNumber,
      glass_location: values.glassLocation,
      customer_comment: comment,
      customer_attachments: attachments,
      working_place: workingPlace,
    }

    if (quoteDetails) {
      if (!postData.customer_comment) {
        delete postData.customer_comment
      }
      if (!postData.customer_attachments?.length) {
        delete postData.customer_attachments
      }
      delete postData.customer_address
      trackPromise(
        updateQuoteService({ fe_token: quoteId, ...postData }).then((res) => {
          if (res.success) {
            navigate(`/quote/${quoteId}`)
          } else {
            toast(res.message)
          }
        }),
      )
    } else {
      if (getRequestedURL()) {
        postData.fe_requested_url = getRequestedURL()
      }
      trackPromise(
        createQuoteService(postData).then((res) => {
          if (res.success) {
            navigate('/quote/' + res.data.fe_token)
            clearRequestedURL()
          } else {
            toast(res.message)
          }
        }),
      )
    }
  }

  const fetchVehData = (license: string | undefined) => {
    if (!!license) {
      // fetch vehicle data
      trackPromise(
        getVehicleService(license)
          .then((res) => {
            if (res.success && res.data?.Model) {
              setVehData(res.data)
              formik.setFieldValue(FormFieldIds.REGISTRATION_NUMBER, license)
            }
          })
          .catch(() => {}),
      )
    }
  }

  const handleChangeBillingAddres = (address: Address | undefined) => {
    formik.setFieldValue(FormFieldIds.INVOICE_ADDRESS, address?.postcode)
    setBillingAddress(address)
  }

  const handleChangeFiles = (files: Attachment[]) => {
    setAttachments(files)
  }

  const handleVehInputChange = (data: string | undefined) => {
    const formatedNumber = formatLicenseNumber(data)
    setLicense(formatedNumber)
    fetchVehData(formatedNumber)
  }

  const getBeforeAfterImages = () => {
    if (formik.values?.registrationNumber && formik.values?.glassLocation?.length) {
      beforeAfterService(
        BeforeAfterType.NEW_INQUIRY,
        formik.values.registrationNumber,
        formik.values?.glassLocation,
      ).then((res) => {
        if (res.success) {
          setBeforeAfterItems(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (formik.values?.registrationNumber && formik.values?.glassLocation?.length) {
      getBeforeAfterImages()
    }
  }, [formik.values])

  useEffect(() => {
    if (quoteDetails) {
      handleChangeBillingAddres(quoteDetails.invoice_address)
      setFixingAddressText(formatAddress(quoteDetails.delivery_address))
      setComments(quoteDetails.customer_comments?.reverse() || [])
      setWorkingPlace(quoteDetails.working_place)
      formik.setFieldValue(FormFieldIds.FIRST_NAME, quoteDetails?.customer_f_name)
      formik.setFieldValue(FormFieldIds.LAST_NAME, quoteDetails?.customer_s_name)
      formik.setFieldValue(FormFieldIds.EMAIL, quoteDetails?.customer_email)
      formik.setFieldValue(FormFieldIds.PHONE, quoteDetails?.customer_phone)

      // send previously selected windows to window selection component
      const selectedWindows: string[] = []
      const selected = editMode ? quoteDetails.glass_location || [] : []
      if (selected.length > 0) {
        for (let i = 0; i < selected.length; i++) {
          // capitalize first letter to match window name
          selectedWindows.push(selected[i].charAt(0).toUpperCase() + selected[i].slice(1))
        }
        setBrokenWindowsToComponent(selectedWindows)
      }
    }
  }, [quoteDetails])

  useEffect(() => {
    fetchVehData(licenseNum)
  }, [licenseNum])

  useEffect(() => {
    if (editMode && quoteId) {
      getQuote()
    }
  }, [editMode, quoteId])

  return (
    <div className='customer-page'>
      <form onSubmit={formik.handleSubmit}>
        <section className='sec-title bg-grey'>
          <div className='container'>
            <h1 className='fnt-48 fnt-md-60 fw-n text-primary px-md-5'>Get a Quote</h1>
          </div>
        </section>

        <section className='sec-banner d-none d-md-block'></section>

        <section className='sec-quote py-3'>
          <div className='d-flex flex-column align-items-center p-3'>
            <div id={FormFieldIds.REGISTRATION_NUMBER}>
              <LicensePlate
                placeholderVal={'ENTER REG'}
                licenseNumber={licenseSearchVal}
                model={!!vehData ? vehData.Make + ' ' + vehData.Model : ''}
                debounceTime={2000}
                showEdit={true}
                handleVehInputChange={handleVehInputChange}
              />
              <small className='form-error ms-0 mt-3'>
                {formik.touched.registrationNumber && formik.errors.registrationNumber}
              </small>
            </div>
          </div>
        </section>

        <section className='sec-customer bg-grey p-3 pb-md-5'>
          <div className='container'>
            <div className='tab-content'>
              <div className='row' id='scroll-to-top'></div>
              <div className='row mt-4 mt-md-5 text-center'>
                <div className='col-md-9 mx-auto'>
                  <div>
                    <div id={FormFieldIds.GLASS_LOCATION}>
                      <h2 className='fnt-48 fnt-md-60 fw-n text-primary'>Select Glasses </h2>
                      <div className='fnt-20 fnt-md-28 text-primary'>Tap directly or select below</div>
                    </div>

                    <small className='form-error ms-0 mt-3'>
                      {formik.touched.glassLocation && formik.errors.glassLocation}
                    </small>

                    <div className='parent mt-4 mt-md-5'>
                      {/* car image display */}
                      <WindowSelector
                        carType={selectedCarType}
                        setCarType={setSelectedCarType}
                        brokenWindowsToCustomer={brokenWindowsToCustomer}
                        brokenWindowsToComponent={brokenWindowsToComponent}
                      />

                      <div className='fnt-20 fnt-md-28 text-primary mb-2 mt-4 mt-md-5'>Place of Invervention</div>

                      <div className='invervention-wrap'>
                        <FormControl>
                          <RadioGroup
                            row
                            value={workingPlace}
                            onChange={(_, value) => setWorkingPlace(value as WorkingPlace)}
                          >
                            <FormControlLabel
                              value={WorkingPlace.MOBILE}
                              control={
                                <Radio
                                  sx={{
                                    color: '#9a73dd',
                                    '&.Mui-checked': { color: '#9a73dd' },
                                  }}
                                />
                              }
                              label='At your home / work'
                            />
                            <FormControlLabel
                              value={WorkingPlace.WORKSHOP}
                              control={
                                <Radio
                                  sx={{
                                    color: '#9a73dd',
                                    '&.Mui-checked': { color: '#9a73dd' },
                                  }}
                                />
                              }
                              label='Our Workshop'
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>

                      <div className='fnt-20 fnt-md-28 text-primary mb-2 mt-4 mt-md-5'>Your comments (optional)</div>
                      {comments.map((item, index) => (
                        <div key={index} className='text-left'>
                          <p>
                            <strong>Comment {index + 1}: </strong>
                            {item.comment}
                          </p>
                          <AddPictures disabled={true} attachments={item.attachments} />
                        </div>
                      ))}

                      <div className='form-group mb-4'>
                        <textarea
                          name=''
                          id=''
                          rows={4}
                          className='form-control round h-auto'
                          placeholder='Details for glass or any other comment.'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>

                      <AddPictures attachments={attachments} onChangeFiles={handleChangeFiles} />
                      <small className='fnt-12 fnt-md-14 text-grey mt-2'>* Optional (Recommended)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='sec-form'>
          <div className='row justify-content-center'>
            <div className='col-md-8 p-0'>
              <div className='fnt-20 fnt-md-28 text-primary mb-2'>Fill your personal details</div>
              <div className='row'>
                <div className='col-md-6'>
                  <div id={FormFieldIds.FIRST_NAME} className='form-group mb-4'>
                    <label className={formik.touched.firstName && !!formik.errors.firstName ? ' error' : ''}>
                      First name
                    </label>
                    <OutlinedInput
                      value={formik.values.firstName}
                      fullWidth
                      className='glass-form-control round'
                      placeholder='First name'
                      onChange={(e) => formik.setFieldValue('firstName', e.target.value)}
                      error={formik.touched.firstName && !!formik.errors.firstName}
                    />
                    <small className='form-error'>{formik.touched.firstName && formik.errors.firstName}</small>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div id={FormFieldIds.LAST_NAME} className='form-group mb-4'>
                    <label className={formik.touched.firstName && !!formik.errors.firstName ? ' error' : ''}>
                      Last name
                    </label>
                    <OutlinedInput
                      value={formik.values.lastName}
                      fullWidth
                      className='glass-form-control round'
                      placeholder='Last name'
                      onChange={(e) => formik.setFieldValue('lastName', e.target.value)}
                      error={formik.touched.lastName && !!formik.errors.lastName}
                    />
                    <small className='form-error'>{formik.touched.lastName && formik.errors.lastName}</small>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div id={FormFieldIds.EMAIL} className='form-group mb-4'>
                    <label className={formik.touched.email && !!formik.errors.email ? ' error' : ''}>Email</label>
                    <OutlinedInput
                      value={formik.values.email}
                      fullWidth
                      className='glass-form-control round'
                      placeholder='Email'
                      onChange={(e) => formik.setFieldValue('email', e.target.value)}
                      error={formik.touched.email && !!formik.errors.email}
                    />
                    <small className='form-error'>{formik.touched.email && formik.errors.email}</small>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div id={FormFieldIds.PHONE} className='form-group mb-4'>
                    <label className={formik.touched.phone && !!formik.errors.phone ? ' error' : ''}>Phone</label>
                    <OutlinedInput
                      value={formik.values.phone}
                      fullWidth
                      className='glass-form-control round'
                      placeholder='Phone'
                      onChange={(e) => formik.setFieldValue('phone', e.target.value)}
                      error={formik.touched.phone && !!formik.errors.phone}
                    />
                    <small className='form-error'>{formik.touched.phone && formik.errors.phone}</small>
                  </div>
                </div>
                <div className='col-md-12'>
                  <div id={FormFieldIds.INVOICE_ADDRESS} className='form-group mb-4'>
                    <div className='d-flex justify-content-between'>
                      <label
                        className={formik.touched.invoiceAddress && !!formik.errors.invoiceAddress ? ' error' : ''}
                      >
                        Postcode
                      </label>
                      {!!quoteDetails?.customer_id && !!quoteId && editMode && (
                        <ChangeAddress
                          qid={quoteId}
                          customerId={quoteDetails.customer_id}
                          addressType={AddressType.INVOICE}
                          initialAddress={quoteDetails.invoice_address}
                          onChangeAddress={(event) => {
                            handleChangeBillingAddres(event)
                          }}
                        />
                      )}
                    </div>
                    <AddressInput
                      address={billingAddress}
                      formError={formik.touched.invoiceAddress && !!formik.errors.invoiceAddress}
                      onChange={handleChangeBillingAddres}
                      disabled={editMode}
                    />
                    <small className='form-error'>
                      {formik.touched.invoiceAddress && formik.errors.invoiceAddress}
                    </small>
                  </div>
                </div>
                {editMode && (
                  <div className='col-md-12'>
                    <div className='form-group mb-4'>
                      <div className='d-flex justify-content-between'>
                        <div className='h6 text-left text-black-50'>Fixing address</div>
                        {!!quoteDetails?.customer_id && !!quoteId && (
                          <ChangeAddress
                            qid={quoteId}
                            customerId={quoteDetails.customer_id}
                            addressType={AddressType.DELIVERY}
                            initialAddress={quoteDetails.delivery_address}
                            onChangeAddress={(event) => {
                              setFixingAddressText(formatAddress(event))
                            }}
                          />
                        )}
                      </div>
                      <OutlinedInput
                        id='deliveryAddress'
                        value={fixingAddressText || ''}
                        fullWidth
                        className='glass-form-control round'
                        placeholder='Fixing address'
                        disabled={true}
                      />
                    </div>
                  </div>
                )}

                <div className='submit-quote-button'>
                  <button
                    className={'btn-raised round w-100 mb-3' + (formik.isValid ? ' green' : '')}
                    type='button'
                    onClick={handleSubmitClick}
                  >
                    {editMode ? 'Save Quote' : 'Submit Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>

      {!!beforeAfterItems?.length && (
        <OurMethod beforeAfterImages={beforeAfterItems} showTitle={false} showVideos={false} />
      )}
    </div>
  )
}
