import './style.css'
import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Modal } from '@mui/material'
import { Helmet } from 'react-helmet'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate } from 'react-router-dom'
import { AddressInput } from '@glass/components/AddressInput'
import { CustomerChatState } from '@glass/enums'
import { Address, QuoteDto } from '@glass/models'
import { createQuoteService } from '@glass/services/apis/create-quote.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type ChatProps = { qid?: string }

export const Chat: React.FC<ChatProps> = ({ qid }) => {
  const navigate = useNavigate()

  const [isOpenChat, setIsOpenChat] = useState<boolean>(false)

  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const licenseRef = useRef<HTMLInputElement>(null)
  const [billingAddress, setBillingAddress] = useState<Address | undefined>()

  const [incorrectFormIndex, setIncorrectFormIndex] = useState(99)
  const [submitClicked, setSubmitClicked] = useState(false)
  const [onSubmitMessage, setOnSubmitMessage] = useState('')

  const patternMatch = () => {
    if (licenseRef.current) {
      licenseRef.current.value = formatLicenseNumber(licenseRef.current.value)
    }
  }

  const checkIfFilled = (value: string | undefined, errorMsg: string, formIndex: number) => {
    if (!value) {
      setOnSubmitMessage(errorMsg)
      setIncorrectFormIndex(formIndex)
      return true
    }
    return false
  }

  const handleSubmitClick = () => {
    const firstNameNotFilled = checkIfFilled(firstNameRef?.current?.value, 'First name not filled', 0)
    const lastNameNotFilled = checkIfFilled(lastNameRef?.current?.value, 'Last name not filled', 1)
    const licenseNotFilled = checkIfFilled(licenseRef?.current?.value, 'Reg number not filled', 2)
    const phoneNotFilled = checkIfFilled(phoneRef?.current?.value, 'Phone number not filled', 3)
    const billingNotFilled = checkIfFilled(billingAddress?.postcode, 'Postal code not filled', 4)

    // enable submit request if all form fields are filled (more conditions can be added)
    if (firstNameNotFilled || lastNameNotFilled || licenseNotFilled || phoneNotFilled || billingNotFilled) {
      return
    }

    // post data
    setSubmitClicked(true)
    const firstName = firstNameRef?.current?.value || ''
    const lastName = lastNameRef?.current?.value || ''
    const fullName = `${firstName} ${lastName}`

    const postData: QuoteDto = {
      customer_chat_state: CustomerChatState.CUSTOMER_REQUEST_CHAT,
      customer_name: fullName,
      customer_f_name: firstName,
      customer_s_name: lastName,
      customer_phone: phoneRef.current?.value || '',
      customer_address: {
        postcode: billingAddress?.postcode || '',
      },
      registration_number: licenseRef.current?.value || '',
    }

    trackPromise(
      createQuoteService(postData).then((res) => {
        if (res.success) {
          navigate('/quote/' + res.data.fe_token)
        }
      }),
    )
  }

  return (
    <>
      {!qid && <div className='start-chart-btn' onClick={() => setIsOpenChat(true)}></div>}

      <Modal
        open={isOpenChat}
        aria-labelledby='child-modal-title'
        disableAutoFocus={true}
        keepMounted={true}
        aria-describedby='child-modal-description'
      >
        <Box
          sx={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            width: '90%',
            height: 'auto',
            backgroundColor: '#EEF4F8',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            maxWidth: '560px',
            p: 4,
          }}
        >
          <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
            <CloseIcon className='closeBtn' onClick={() => setIsOpenChat(false)} />
          </Box>
          {!!qid ? (
            <Helmet>
              <link rel='stylesheet' href={`${process.env.REACT_APP_API_DOMAIN_URL}/im_livechat/external_lib.css`} />
              <script
                type='text/javascript'
                src={`${process.env.REACT_APP_API_DOMAIN_URL}/im_livechat/external_lib.js`}
              ></script>
              <script
                type='text/javascript'
                src={`${process.env.REACT_APP_API_DOMAIN_URL}/im_livechat/loader/1?fe_token=${qid}`}
              ></script>
            </Helmet>
          ) : (
            <>
              <form>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-group mb-4'>
                      <div className='h6 text-left text-black-50'>First name</div>
                      <input
                        ref={firstNameRef}
                        type='text'
                        className={incorrectFormIndex === 0 ? 'form-control form-not-filled' : 'form-control'}
                        placeholder='First name'
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
                      />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-group mb-4'>
                      <div className='h6 text-left text-black-50'>Reg Number</div>
                      <input
                        ref={licenseRef}
                        type='text'
                        className={incorrectFormIndex === 2 ? 'form-control form-not-filled' : 'form-control'}
                        placeholder='Reg Number'
                        onChange={patternMatch}
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group mb-4'>
                      <div className='h6 text-left text-black-50'>Postcode</div>
                      <AddressInput
                        address={billingAddress}
                        formError={incorrectFormIndex === 4}
                        onChange={setBillingAddress}
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div className='row justify-content-center'>
                <div className='col-md-6'>
                  <div className='submit-request-msg'>{onSubmitMessage}</div>
                  <button className='btn-raised w-100' onClick={handleSubmitClick} disabled={submitClicked}>
                    Submit request
                  </button>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  )
}
