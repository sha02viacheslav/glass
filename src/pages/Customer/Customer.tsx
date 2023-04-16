import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { autocomplete } from 'getaddress-autocomplete'
import { trackPromise } from 'react-promise-tracker'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AddPictures } from '@glass/components/AddPictures'
import { LicensePlate } from '@glass/components/LicensePlate'
import { WindowSelector } from '@glass/components/WindowSelector'
import { CarType } from '@glass/enums'
import { REACT_APP_AUTOCOMPLETE } from '@glass/envs'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Address, Attachment, VehicleData } from '@glass/models'
import { createQuoteService } from '@glass/services/apis/create-quote.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export const Customer: React.FC = () => {
  const [quoteInfo] = useState(JSON.parse(sessionStorage.getItem('quoteInfo') || '[]'))
  const [, setVehicleData] = useState('')
  const { licenseNum } = useParams()
  const [licenseSearchVal, setLicense] = useState(licenseNum || '')
  const [vehData, setVehData] = useState<VehicleData | undefined>()
  const [billingAddressVal, setBillingAddress] = useState(quoteInfo.address || '')
  const [fullAddress, setFullAddress] = useState<Address | undefined>(undefined)
  const firstName = quoteInfo.firstName || ''
  const lastName = quoteInfo.lastName || ''
  const email = quoteInfo.email || ''
  const phone = quoteInfo.phone || ''
  const selected = quoteInfo.selected || []
  const navigate = useNavigate()

  // keep track if request can be submitted
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const billingRef = useRef<HTMLInputElement>(null)

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
  const brokenWindowsToCustomer = (windows: string[]) => {
    setSelectedBrokenWindows(windows)
  }
  // preselect broken windows if editing quote
  const [brokenWindowsToComponent, setBrokenWindowsToComponent] = useState<string[]>([])

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
    const billingNotFilled = checkIfFilled(billingRef?.current?.value, 'Postal code not filled', 4)
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
    } else {
      // post data
      setSubmitClicked(true)
      const firstName = firstNameRef?.current?.value || ''
      const lastName = lastNameRef?.current?.value || ''
      const fullName = `${firstName} ${lastName}`
      // const formattedAddress = fullAddress?.formatted_address.filter(Boolean).join(', ') + ' ' + fullAddress?.postcode
      trackPromise(
        createQuoteService({
          customer_name: fullName,
          customer_f_name: firstName,
          customer_s_name: lastName,
          customer_phone: phoneRef?.current?.value || '',
          customer_email: emailRef?.current?.value || '',
          customer_address: {
            // more detailed address info
            postcode: fullAddress?.postcode || '',
            latitude: fullAddress?.latitude || '',
            longitude: fullAddress?.longitude || '',
            line_1: fullAddress?.line_1 || '',
            line_2: fullAddress?.line_2 || '',
            line_3: fullAddress?.line_3 || '',
            line_4: fullAddress?.line_4 || '',
            locality: fullAddress?.locality || '',
            town_or_city: fullAddress?.town_or_city || '',
            county: fullAddress?.county || '',
            district: fullAddress?.district || '',
            country: fullAddress?.country || '',
          },
          registration_number: licenseSearchVal,
          glass_location: selectedBrokenWindows || [],
          customer_comments: {
            comment: comment,
            attachments: attachments,
          },
        }).then((res) => {
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
          .catch(() => {
            setVehicleData('No Data Found! Error in API.')
          }),
      )
    }
  }

  const handleChangeFiles = (files: Attachment[]) => {
    setAttachments(files)
  }

  useEffect(() => {
    fetchVehData(licenseNum)
    // scroll car into view on page load
    // if (!submitClicked) {
    //     const windowSelector = document.getElementById("scroll-focus");
    //     windowSelector.scrollIntoView();
    // }
    // necessary in case returning from quote page navbar would not load unless the page is refreshed
    const navbarMain = document.getElementById('navbar-main')
    const footerMain = document.getElementById('footer-main')
    if (navbarMain) navbarMain.style.display = 'inline'
    if (footerMain) footerMain.style.display = 'inline'

    // Integration of PostalCode/ Address AutoComplete API
    autocomplete('billingAddress', REACT_APP_AUTOCOMPLETE, {
      delay: 500,
    })

    // Preventing Default to show complete address with Postal Code
    window.addEventListener('getaddress-autocomplete-address-selected', function (e) {
      e.preventDefault()
      // @ts-ignore
      const address: Address = e.address
      setFullAddress(address)
      const tempAddress = address.formatted_address.filter(Boolean).join(', ') + ' ' + address.postcode
      setBillingAddress(tempAddress)
    })

    // send previously selected windows to window selection component
    const selectedWindows: string[] = []
    if (selected.length > 0) {
      for (let i = 0; i < selected.length; i++) {
        // capitalize first letter to match window name
        selectedWindows.push(selected[i].charAt(0).toUpperCase() + selected[i].slice(1))
      }
      setBrokenWindowsToComponent(selectedWindows)
    }
  }, [])

  const handleVehInputChange = (data: string | undefined) => {
    fetchVehData(data)
    setLicense(formatLicenseNumber(data))
  }

  const handlePCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBillingAddress(event.target.value)
  }

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

                      <AddPictures onChangeFiles={handleChangeFiles} />
                      <small className='d-block mt-2'>*Recommended</small>
                      <form action='' className='form-car my-md-5 my-4'>
                        <p className='fs-18 text-blue'>Fill your personal details</p>
                        <br />
                        <div className='row' key={quoteInfo}>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <input
                                ref={firstNameRef}
                                type='text'
                                className={incorrectFormIndex === 0 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='First name'
                                defaultValue={firstName}
                              />
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <input
                                ref={lastNameRef}
                                type='text'
                                className={incorrectFormIndex === 1 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Last name'
                                defaultValue={lastName}
                              />
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <input
                                ref={emailRef}
                                type='text'
                                className={incorrectFormIndex === 2 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Email'
                                defaultValue={email}
                              />
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div className='form-group mb-4'>
                              <input
                                ref={phoneRef}
                                type='text'
                                className={incorrectFormIndex === 3 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Phone'
                                defaultValue={phone}
                              />
                            </div>
                          </div>
                          <div className='col-md-12'>
                            <div className='form-group mb-4'>
                              <input
                                id='billingAddress'
                                ref={billingRef}
                                type='text'
                                className={incorrectFormIndex === 4 ? 'form-control form-not-filled' : 'form-control'}
                                placeholder='Billing address'
                                onChange={handlePCodeChange}
                                value={billingAddressVal}
                              />
                            </div>
                          </div>
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
                            Submit request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <br />
                <div className='position-relative pt-md-4'>
                  <img src={process.env.PUBLIC_URL + '/img/hand-pic.png'} className='img-fluid w-100 mob-h' alt='' />
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
