import React, { useEffect, useRef, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { updateQuoteService } from '@glass/services/apis/update-quote.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

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

  // when true, displays offer info
  const [submitClicked, setSubmitClicked] = useState(false)
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

  useRetrieveVehData(vehData?.VehicleRegistration, retrieveVehData)

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
    setSubmitClicked(true)
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
      customer_comments: {
        comment: comment,
        attachments: attachments,
      },
    }

    if (quoteDetails) {
      if (!postData.customer_comments?.comment && !postData.customer_comments?.attachments?.length) {
        delete postData.customer_comments
      }
      delete postData.customer_address
      trackPromise(
        updateQuoteService({ fe_token: quoteId, ...postData }).then((res) => {
          if (res.success) {
            navigate(`/quote/${quoteId}`)
          }
        }),
      )
    } else {
      trackPromise(
        createQuoteService(postData).then((res) => {
          if (res.success) {
            navigate('/quote/' + res.data.fe_token)
          }
        }),
      )
    }
  }

  const fetchVehData = (license: string | undefined) => {
    if (license !== undefined) {
      // fetch vehicle data
      trackPromise(
        fetch(process.env.REACT_APP_VEH_DATA + license)
          .then((res) => res.json())
          .then((data) => {
            if (
              data.Response.StatusCode === 'KeyInvalid' ||
              data.Response.StatusCode === 'ItemNotFound' ||
              data.Response.StatusCode === 'SandboxLimitation'
            ) {
              return
            } else {
              setVehData(data.Response.DataItems)
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
    <div>
      <section className='sec-customer my-4 my-md-5'>
        <div className='container'>
          <div className='tab-content'>
            <div className='row' id='scroll-to-top'>
              <LicensePlate
                placeholderVal={'NU71 REG'}
                licenseNumber={licenseSearchVal}
                model={
                  !!vehData
                    ? vehData.VehicleRegistration.Make + ' ' + vehData.VehicleRegistration.Model
                    : 'Make & Model'
                }
                handleVehInputChange={handleVehInputChange}
              />
              <br />
            </div>
            <div className='row mt-4 mt-md-5 text-center'>
              <div className='col-md-9 mx-auto'>
                {!submitClicked && (
                  <div>
                    <div id='scroll-focus'>
                      <h2 className='text-blue  text-24'>Select Broken Glasses</h2>
                      <p>Tap directly or select below</p>
                    </div>

                    <div className='parent'>
                      {/* car image display */}
                      <WindowSelector
                        carType={selectedCarType}
                        setCarType={setSelectedCarType}
                        brokenWindowsToCustomer={brokenWindowsToCustomer}
                        brokenWindowsToComponent={brokenWindowsToComponent}
                      />
                      <br />
                      <br />
                      <p className='fs-18 text-blue'>Your comments (optional)</p>

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
                          className='form-control h-auto'
                          placeholder='Details for glass or any other comment.'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>

                      <AddPictures attachments={attachments} onChangeFiles={handleChangeFiles} />
                      <small className='d-block mt-2'>*Recommended</small>
                      <form className='my-md-5 my-4'>
                        <p className='fs-18 text-blue'>Fill your personal details</p>
                        <br />
                        <div className='row'>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <div className='h6 text-left text-black-50'>First name</div>
                              <input
                                ref={firstNameRef}
                                type='text'
                                className={incorrectFormIndex === 0 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='First name'
                                defaultValue={quoteDetails?.customer_f_name}
                              />
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <div className='h6 text-left text-black-50'>Last name</div>
                              <input
                                ref={lastNameRef}
                                type='text'
                                className={incorrectFormIndex === 1 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Last name'
                                defaultValue={quoteDetails?.customer_s_name}
                              />
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <div className='h6 text-left text-black-50'>Email</div>
                              <input
                                ref={emailRef}
                                type='text'
                                className={incorrectFormIndex === 2 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Email'
                                defaultValue={quoteDetails?.customer_email}
                              />
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <div className='h6 text-left text-black-50'>Phone</div>
                              <input
                                ref={phoneRef}
                                type='text'
                                className={incorrectFormIndex === 3 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Phone'
                                defaultValue={quoteDetails?.customer_phone}
                                disabled={editMode}
                              />
                            </div>
                          </div>
                          <div className='col-md-12'>
                            <div className='form-group mb-4'>
                              <div className='d-flex justify-content-between'>
                                <div className='h6 text-left text-black-50'>Postcode</div>
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
                                  className='form-control'
                                  placeholder='Fixing address'
                                  value={fixingAddressText || ''}
                                  disabled={true}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                      {/* submit request button */}
                      <div className='row'>
                        <div className='col-md-7 mx-auto'>
                          <div className='submit-request-msg'>{onSubmitMessage}</div>
                          <button
                            className='btn btn-purple-radius w-100 mb-3'
                            onClick={handleSubmitClick}
                            id='submitBtn'
                          >
                            {editMode ? 'Save Quote' : 'Submit request'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!editMode && (
                  <>
                    <br />
                    <div className='position-relative pt-md-4'>
                      <img
                        src={process.env.PUBLIC_URL + '/img/hand-pic.png'}
                        className='img-fluid w-100 mob-h'
                        alt=''
                      />
                      <div className='recycle-content text-start phn-content'>
                        <div className='d-flex justify-content-between'>
                          <div className='content-left'>
                            <h2 className='text-white mb-2'>Mobile Service </h2>
                            <p className='fw-light fs-14 mb-0 text-white'>We come to your home or work.</p>
                            <p className='mb-2 text-white'>Replacement 1-2 h</p>
                            <Link to='/react/customer' className='btn  text-purple bg-white'>
                              Get a Quote
                            </Link>
                          </div>
                          <div className='re-img mt-auto'>
                            <img src={process.env.PUBLIC_URL + '/img/phn.png'} className='img-fluid' alt='' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
