import './Customer.css'
import React, { useEffect, useRef, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AddPictures } from '@glass/components/AddPictures'
import { AddressInput } from '@glass/components/AddressInput/AddressInput'
import { ChangeAddress } from '@glass/components/ChangeAddress'
import { LicensePlate } from '@glass/components/LicensePlate'
import { WindowSelector } from '@glass/components/WindowSelector'
import { AddressType, CarType } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Address, Attachment, Comment, Quote, QuoteDto, VehicleData } from '@glass/models'
import { createQuoteService } from '@glass/services/apis/create-quote.service'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { getVehicleService } from '@glass/services/apis/get-vehicle.service'
import { updateQuoteService } from '@glass/services/apis/update-quote.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import { clearRequestedURL, getRequestedURL } from '@glass/utils/session/session.util'

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

  // keep track if request can be submitted
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  const [comment, setComment] = useState<string>('')
  const [attachments, setAttachments] = useState<Attachment[]>([])

  // for determining which form is not filled
  const [incorrectFormIndex, setIncorrectFormIndex] = useState(99)

  const [onSubmitMessage, setOnSubmitMessage] = useState('')

  // temporary things for car selection menu - Rainer
  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)

  // for getting the array of broken windows
  const [selectedBrokenWindows, setSelectedBrokenWindows] = useState<string[]>([])

  // preselect broken windows if editing quote
  const [brokenWindowsToComponent, setBrokenWindowsToComponent] = useState<string[]>([])

  const brokenWindowsToCustomer = (windows: string[]) => {
    setSelectedBrokenWindows(windows)
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

  // functions for checking if necessary fields are filled and enable submit request
  const checkIfFilled = (value: string | undefined, errorMsg: string, formIndex: number) => {
    if (!value) {
      setOnSubmitMessage(errorMsg)
      setIncorrectFormIndex(formIndex)
      return true
    }
    return false
  }

  // check if any windows are selected before submit request
  function checkIfSelected() {
    if (selectedBrokenWindows.length === 0) {
      setOnSubmitMessage('Select windows that need replacing')
      return true
    }
    return false
  }

  const retrieveVehData = (data: CarType) => {
    setSelectedCarType(data)
  }

  useRetrieveVehData(vehData, retrieveVehData)

  function handleSubmitClick() {
    const firstNameNotFilled = checkIfFilled(firstNameRef?.current?.value, 'First name not filled', 0)
    const lastNameNotFilled = checkIfFilled(lastNameRef?.current?.value, 'Last name not filled', 1)
    const emailNotFilled = checkIfFilled(emailRef?.current?.value, 'Email not filled', 2)
    const phoneNotFilled = checkIfFilled(phoneRef?.current?.value, 'Phone number not filled', 3)
    const billingNotFilled = checkIfFilled(billingAddress?.postcode, 'Postal code not filled', 4)
    const licenseNumNotFilled = checkIfFilled(licenseSearchVal, 'License number not filled', 5)
    const windowNotFilled = checkIfSelected()

    // enable submit request if all form fields are filled (more conditions can be added)
    if (
      firstNameNotFilled ||
      lastNameNotFilled ||
      emailNotFilled ||
      phoneNotFilled ||
      billingNotFilled ||
      windowNotFilled ||
      licenseNumNotFilled
    ) {
      return
    }

    // post data
    const firstName = (firstNameRef?.current?.value || '').trim()
    const lastName = (lastNameRef?.current?.value || '').trim()
    const fullName = `${firstName} ${lastName}`

    const postData: QuoteDto = {
      customer_name: fullName,
      customer_f_name: firstName,
      customer_s_name: lastName,
      customer_phone: (phoneRef?.current?.value || '').trim(),
      customer_email: (emailRef?.current?.value || '').trim(),
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
      registration_number: licenseSearchVal,
      glass_location: (selectedBrokenWindows || []).map((item) => item.toLowerCase()),
      customer_comment: comment,
      customer_attachments: attachments,
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
            setOnSubmitMessage(res.message)
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
            if (res.success) {
              setVehData(res.data)
            }
          })
          .catch(() => {}),
      )
    }
  }

  const handleChangeFiles = (files: Attachment[]) => {
    setAttachments(files)
  }

  const handleVehInputChange = (data: string | undefined) => {
    fetchVehData(data)
    setLicense(formatLicenseNumber(data))
  }

  useEffect(() => {
    if (quoteDetails) {
      setBillingAddress(quoteDetails.invoice_address)
      setFixingAddressText(formatAddress(quoteDetails.delivery_address))
      setComments(quoteDetails.customer_comments?.reverse() || [])

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
      <section className='sec-title bg-grey'>
        <div className='container'>
          <h1 className='fnt-48 fnt-md-60 fw-n text-primary px-md-5'>Get a Quote</h1>
        </div>
      </section>

      <section className='sec-banner d-none d-md-block'></section>

      <section className='sec-quote py-3'>
        <div className='d-flex flex-column align-items-center p-3'>
          <LicensePlate
            placeholderVal={'ENTER REG'}
            licenseNumber={licenseSearchVal}
            model={!!vehData ? vehData.Make + ' ' + vehData.Model : 'Make & Model'}
            debounceTime={2000}
            showEdit={true}
            handleVehInputChange={handleVehInputChange}
          />
        </div>
      </section>

      <section className='sec-customer bg-grey p-3 pb-md-5'>
        <div className='container'>
          <div className='tab-content'>
            <div className='row' id='scroll-to-top'></div>
            <div className='row mt-4 mt-md-5 text-center'>
              <div className='col-md-9 mx-auto'>
                <div>
                  <div id='scroll-focus'>
                    <h2 className='fnt-48 fnt-md-60 fw-n text-primary'>Select Glasses </h2>
                    <div className='fnt-20 fnt-md-28 text-primary'>Tap directly or select below</div>
                  </div>

                  <div className='parent mt-4 mt-md-5'>
                    {/* car image display */}
                    <WindowSelector
                      carType={selectedCarType}
                      setCarType={setSelectedCarType}
                      brokenWindowsToCustomer={brokenWindowsToCustomer}
                      brokenWindowsToComponent={brokenWindowsToComponent}
                    />

                    <div className='fnt-20 fnt-md-28 text-primary mb-2 mt-4 mt-md-5'>Place of Invervention</div>

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
          <form className='col-md-8'>
            <div className='fnt-20 fnt-md-28 text-primary mb-2'>Fill your personal details</div>
            <div className='row'>
              <div className='col-md-6'>
                <div className='form-group mb-4'>
                  <label>First name</label>
                  <input
                    ref={firstNameRef}
                    type='text'
                    className={incorrectFormIndex === 0 ? 'form-control round form-not-filled' : 'form-control round'}
                    placeholder='First name'
                    defaultValue={quoteDetails?.customer_f_name}
                  />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group mb-4'>
                  <label>Last name</label>
                  <input
                    ref={lastNameRef}
                    type='text'
                    className={incorrectFormIndex === 1 ? 'form-control round form-not-filled' : 'form-control round'}
                    placeholder='Last name'
                    defaultValue={quoteDetails?.customer_s_name}
                  />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group mb-4'>
                  <label>Email</label>
                  <input
                    ref={emailRef}
                    type='text'
                    className={incorrectFormIndex === 2 ? 'form-control round form-not-filled' : 'form-control round'}
                    placeholder='Email'
                    defaultValue={quoteDetails?.customer_email}
                  />
                </div>
              </div>
              <div className='col-md-6'>
                <div className='form-group mb-4'>
                  <label>Phone</label>
                  <input
                    ref={phoneRef}
                    type='text'
                    className={incorrectFormIndex === 3 ? 'form-control round form-not-filled' : 'form-control round'}
                    placeholder='Phone'
                    defaultValue={quoteDetails?.customer_phone}
                    disabled={editMode}
                  />
                </div>
              </div>
              <div className='col-md-12'>
                <div className='form-group mb-4'>
                  <div className='d-flex justify-content-between'>
                    <label>Postcode</label>
                    {!!quoteDetails?.customer_id && !!quoteId && editMode && (
                      <ChangeAddress
                        qid={quoteId}
                        customerId={quoteDetails.customer_id}
                        addressType={AddressType.INVOICE}
                        initialAddress={quoteDetails.invoice_address}
                        onChangeAddress={(event) => {
                          setBillingAddress(event)
                        }}
                      />
                    )}
                  </div>
                  <AddressInput
                    address={billingAddress}
                    formError={incorrectFormIndex === 4}
                    onChange={setBillingAddress}
                    disabled={editMode}
                  />
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
                    <input
                      id='deliveryAddress'
                      type='text'
                      className='form-control round'
                      placeholder='Fixing address'
                      value={fixingAddressText || ''}
                      disabled={true}
                    />
                  </div>
                </div>
              )}

              <div className='col-md-7 mx-auto'>
                <div className='submit-request-msg'>{onSubmitMessage}</div>
                <button className='btn-raised round w-100 mb-3' type='button' onClick={handleSubmitClick}>
                  {editMode ? 'Save Quote' : 'Submit Request'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
