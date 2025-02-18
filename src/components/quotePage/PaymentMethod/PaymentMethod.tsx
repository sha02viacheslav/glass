import './PaymentMethod.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { autocomplete } from 'getaddress-autocomplete'
import moment from 'moment'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'
import { Checkout } from '@glass/components/quotePage/Checkout'
import { PaymentMethodType, PaymentOptionEnum, PaymentStatus, QuoteAction } from '@glass/enums'
import { REACT_APP_AUTOCOMPLETE } from '@glass/envs'
import { Address, MonthlyPayment, PaTransaction, PaymentOptionDto, PaymentSchedule, Quote } from '@glass/models'
import { customerLogService } from '@glass/services/apis/customer-log.service'
import { getPaymentAssistPlanService } from '@glass/services/apis/get-payment-assist-plan.service'
import { updatePaymentMethod } from '@glass/services/apis/update-payment-method.service'
import { isFourMonths } from '@glass/utils/is-four-months/is-four-months.util'
import { paymentMethodButton } from '@glass/utils/payment-method-button/payment-method-button.util'
import { scrollToElementWithOffset } from '@glass/utils/scroll-to-element/scroll-to-element.util'

export type PaymentMethodProps = {
  quoteDetails?: Quote
  qid: string | undefined
  totalPrice: number
  payAssist: () => void
  refetchQuote: () => void
  PADataToParent?: (value: (string | undefined)[]) => void
  PAUrl?: string
  handleChangePaymentMethod?: (value: PaymentOptionDto) => void
  handleShowEmailMissing: () => void
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  quoteDetails,
  qid,
  totalPrice,
  payAssist,
  refetchQuote,
  PADataToParent,
  PAUrl,
  handleChangePaymentMethod,
  handleShowEmailMissing,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentOptionEnum>(PaymentOptionEnum.NONE)
  const [address, setAddress] = useState('')
  const userBillingAddress = quoteDetails?.c_address || ''
  const [postalCode, setPostalCode] = useState<string>(quoteDetails?.c_postalcode || '')
  const excessRef = useRef<HTMLInputElement>(null)
  const [excess, setExcess] = useState<number>(115)
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType | undefined>(undefined)
  const [tempPaymentMethodType, setTempPaymentMethodType] = useState<PaymentMethodType | undefined>(undefined)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.NOT_PAID)
  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment | undefined>(undefined)
  const [PAErrorMsg] = useState('')
  const PAf_nameRef = useRef<HTMLInputElement>(null)
  const PAs_nameRef = useRef<HTMLInputElement>(null)
  const PAEmailRef = useRef<HTMLInputElement>(null)
  const [startPAProcess, setStartPAProcess] = useState(false)
  const [showPaymentConfirm, setShowPaymentConfirm] = useState<boolean>(false)
  const [showCashConfirm, setShowCashConfirm] = useState<boolean>(false)
  const [showEmailMissingPopup, setShowEmailMissingPopup] = useState<boolean>(false)

  const months = useMemo<number>(() => {
    return isFourMonths(totalPrice) ? 4 : 6
  }, [totalPrice])

  const transactions = useMemo<PaTransaction[]>(() => {
    return quoteDetails?.payment_transaction?.[quoteDetails?.payment_method_type] || []
  }, [quoteDetails])

  const emptyMonthlyPayments = useMemo<MonthlyPayment | undefined>(() => {
    if (quoteDetails?.date_order) {
      const schedules: PaymentSchedule[] = []
      for (let i = 0; i < months; i++) {
        schedules.push({ date: moment(quoteDetails?.date_order).add(i, 'months').format('YYYY-MM-DD'), amount: 0 })
      }
      return {
        amount: 0,
        interest: 0,
        plan: '',
        repayable: 0,
        summary: 'This instalment plan comprises of 4 monthly payments, with the first taken immediately on setup.',
        schedule: schedules,
      }
    }
    return undefined
  }, [quoteDetails?.date_order, months])

  const updateExcess = () => {
    if (excessRef?.current?.value) setExcess(Number(excessRef.current.value))
  }

  const handlePCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }

  const updatePAInfo = () => {
    const firstName = PAf_nameRef?.current?.value
    const secondName = PAs_nameRef?.current?.value
    const email = PAEmailRef?.current?.value
    const data = [firstName, secondName, email, postalCode, address]
    if (PADataToParent) PADataToParent(data)
  }

  const checkEligibility = () => {
    // communicate with Payment (parent)
    payAssist()
  }

  const handleChangePaymentMethodType = (value: PaymentMethodType) => {
    if (value == paymentMethodType) return

    if (value === PaymentMethodType.STRIPE && (!quoteDetails?.customer_email || quoteDetails?.customer_email == 'na')) {
      setShowEmailMissingPopup(true)
      return
    }

    setTempPaymentMethodType(value)

    if (value === PaymentMethodType.CASH) {
      setShowCashConfirm(true)
    } else {
      setShowPaymentConfirm(true)
    }

    if (qid) {
      customerLogService(qid, `Clicked ${paymentMethodButton(value)}`)
    }
  }

  const handleConfirmCashType = () => {
    setShowPaymentConfirm(true)
    setShowCashConfirm(false)
    if (qid) {
      customerLogService(qid, 'Request Cash = "Yes"')
    }
  }

  const handleCancelCashType = () => {
    setShowCashConfirm(false)
    if (qid) {
      customerLogService(qid, 'Request Cash = "No"')
    }
  }

  const handleConfirmChangePaymentMethodType = () => {
    if (qid && tempPaymentMethodType) {
      setPaymentMethodType(tempPaymentMethodType)
      setShowPaymentConfirm(false)
      updatePaymentMethod(qid, tempPaymentMethodType).then((res) => {
        if (res.success) {
          if (refetchQuote) refetchQuote()
        }
        if (refetchQuote) refetchQuote()
      })

      customerLogService(
        qid,
        `Confirm ${paymentMethodButton(tempPaymentMethodType)} = "${
          tempPaymentMethodType === PaymentMethodType.CASH ? 'Ok' : 'Yes'
        }"`,
      )
    }
  }

  const handleCancelChangePaymentMethodType = () => {
    setShowPaymentConfirm(false)
    if (qid && tempPaymentMethodType) {
      customerLogService(qid, `Confirm ${paymentMethodButton(tempPaymentMethodType)} = "No"`)
    }
  }

  const retrievePlan = () => {
    if (
      qid &&
      quoteDetails?.is_published &&
      paymentStatus !== PaymentStatus.PAID &&
      selectedMethod === PaymentOptionEnum.MONTH_INSTALLMENT &&
      !monthlyPayments
    ) {
      // retrieve payment assist plan data
      getPaymentAssistPlanService(
        qid,
        isFourMonths(totalPrice) ? PaymentMethodType.ASSIST_FOUR_PAYMENT : PaymentMethodType.ASSIST_SIX_PAYMENT,
      ).then((res) => {
        if (res.success) {
          setMonthlyPayments(res.data)
        }
      })
    }
  }

  const handleChangePaymentOption = (method: PaymentOptionEnum) => {
    setSelectedMethod(method)
    if (method === PaymentOptionEnum.MONTH_INSTALLMENT) {
      handleChangePaymentMethodType(
        isFourMonths(totalPrice) ? PaymentMethodType.ASSIST_FOUR_PAYMENT : PaymentMethodType.ASSIST_SIX_PAYMENT,
      )
    }
    scrollToElementWithOffset('quote-card', -16)
  }

  useEffect(() => {
    setPaymentStatus(quoteDetails?.invoice_data?.payment_state || PaymentStatus.NOT_PAID)
  }, [quoteDetails?.invoice_data?.payment_state])

  useEffect(() => {
    if (quoteDetails?.payment_method_type) {
      setPaymentMethodType(quoteDetails.payment_method_type)
      switch (quoteDetails.payment_method_type) {
        case PaymentMethodType.ASSIST_FOUR_PAYMENT:
        case PaymentMethodType.ASSIST_SIX_PAYMENT: {
          setSelectedMethod(PaymentOptionEnum.MONTH_INSTALLMENT)
          break
        }
        case PaymentMethodType.STRIPE:
        case PaymentMethodType.CASH: {
          setSelectedMethod(PaymentOptionEnum.SINGLE_PAY)
          break
        }
      }
    }
  }, [quoteDetails?.payment_method_type])

  useEffect(() => {
    retrievePlan()
  }, [selectedMethod, quoteDetails])

  useEffect(() => {
    // Integration of PostalCode/ Address AutoComplete API
    autocomplete('autocomplete-field', REACT_APP_AUTOCOMPLETE, {
      delay: 500,
    })
    // Preventing Default to show complete address with Postal Code
    window.addEventListener('getaddress-autocomplete-address-selected', (e) => {
      e.preventDefault()
      // @ts-ignore
      const address: Address = e.address
      const tempAddress = address.formatted_address.filter(Boolean).join(', ')
      const postalcode = address.postcode
      setAddress(tempAddress)
      setPostalCode(postalcode)
    })
    setAddress(userBillingAddress)
    // update selected payment method in quote page (parent)
    let msg = QuoteAction.NONE
    if (startPAProcess && PAUrl === '') {
      // if user is in check eligibility phase
      msg = QuoteAction.CHECK_ELIGIBILITY
    } else if (startPAProcess && PAUrl !== '') {
      msg = QuoteAction.CONTINUE_PA
    } else if (!startPAProcess) {
      msg = QuoteAction.GO_PAYMENT
    }
    if (handleChangePaymentMethod) handleChangePaymentMethod({ p_option: selectedMethod, detail: msg })
  }, [selectedMethod, startPAProcess, PAUrl])

  return (
    <div>
      {paymentStatus !== PaymentStatus.PAID && (
        <>
          <div className='fnt-20 fnt-md-28 text-primary text-center p-3'>Select Payment Method And Pay Online</div>
          <div className='row mb-3 px-3'>
            <div className='col-md-6'>
              <button
                className={
                  'btn-stroked round w-100' + (selectedMethod === PaymentOptionEnum.MONTH_INSTALLMENT ? ' active' : '')
                }
                onClick={() => handleChangePaymentOption(PaymentOptionEnum.MONTH_INSTALLMENT)}
              >
                {months} Month £ {(totalPrice / months).toFixed(2)}
              </button>
            </div>
            {/*<button*/}
            {/*  className={'btn-stroked round' + (selectedMethod === PaymentOptionEnum.INSURANCE ? ' active' : '')}*/}
            {/*  onClick={() => handleChangePaymentOption(PaymentOptionEnum.INSURANCE)}*/}
            {/*>*/}
            {/*  <small className='fs-14'>Insurance</small>*/}
            {/*  <div className='PM-price'>£ {excess}</div>*/}
            {/*</button>*/}
            <div className='col-md-6 mt-3 mt-md-0'>
              <button
                className={
                  'btn-stroked round w-100' + (selectedMethod === PaymentOptionEnum.SINGLE_PAY ? ' active' : '')
                }
                onClick={() => handleChangePaymentOption(PaymentOptionEnum.SINGLE_PAY)}
              >
                Single pay £ {totalPrice}
              </button>
            </div>
          </div>
        </>
      )}

      {paymentStatus !== PaymentStatus.PAID && (
        <div className='PM-payment-option bg-grey'>
          {selectedMethod === PaymentOptionEnum.MONTH_INSTALLMENT && (
            <div>
              <p className='text-purple mb-2'>{months}-Month</p>
              <div>
                <p className='mb-3'>{(monthlyPayments || emptyMonthlyPayments)?.summary}</p>
                <div className='PA-plan-container'>
                  {(monthlyPayments || emptyMonthlyPayments)?.schedule.map((element) => (
                    <div className='PA-plan-element' key={element.date}>
                      <div className='PA-plan-date'>{moment(element.date).format('DD MMM YYYY')}</div>
                      <div className='PA-plan-price'>
                        £ {((quoteDetails?.is_published ? element.amount : 0) / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!!transactions?.length && (
                <div className='pt-4 pb-4'>
                  {transactions?.map((transaction) => (
                    <div key={transaction.id} className='d-flex justify-content-between align-items-center mt-2'>
                      <a className='transaction-name' href={transaction.url} rel='noopener noreferrer' target='_blank'>
                        {transaction.token}
                      </a>
                      <span className={`transaction-state-${transaction.state}`}>{transaction.state}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className='PA-status-failed'>{PAErrorMsg}</div>
              {startPAProcess && (
                <div className='PM-insurance-container'>
                  <div className='PM-insurance-sub'>
                    <input
                      type='text'
                      className='form-control PM-top-input'
                      ref={PAf_nameRef}
                      value={quoteDetails?.customer_f_name}
                      onChange={updatePAInfo}
                    />
                    <input
                      type='text'
                      className='form-control PM-top-input'
                      ref={PAs_nameRef}
                      value={quoteDetails?.customer_s_name}
                      onChange={updatePAInfo}
                    />
                  </div>
                  <input
                    type='text'
                    className='form-control PM-email'
                    value={quoteDetails?.customer_email}
                    ref={PAEmailRef}
                    onChange={updatePAInfo}
                  />
                  <input
                    id='autocomplete-field'
                    type='text'
                    className='form-control PM-address'
                    value={address}
                    onChange={handlePCodeChange}
                  />
                  <input
                    type='text'
                    className='form-control PM-postalcode'
                    value={postalCode}
                    onChange={updatePAInfo}
                  />
                </div>
              )}
              <div className='d-flex justify-content-end align-items-center mt-4'>
                {startPAProcess && PAUrl === '' && (
                  <button className='btn-stroked' onClick={checkEligibility}>
                    Check Eligibility
                  </button>
                )}
                {startPAProcess && PAUrl !== '' && (
                  <>
                    <a className='PA-link' href={PAUrl} rel='noopener noreferrer' target='_blank'>
                      {PAUrl}
                    </a>
                    <button className='btn-stroked' onClick={checkEligibility}>
                      Continue
                    </button>
                  </>
                )}
                {!startPAProcess && (
                  <button
                    className='btn-stroked'
                    onClick={() => setStartPAProcess(true)}
                    disabled={!quoteDetails?.is_published}
                  >
                    Pay with Payment Assist
                  </button>
                )}
              </div>
            </div>
          )}
          {selectedMethod === PaymentOptionEnum.INSURANCE && (
            <div>
              <p className='text-purple mb-2'>Insurance</p>
              <div className='PM-insurance-container'>
                <div className='PM-insurance-sub'>
                  <input type='text' className='form-control PM-top-input' placeholder='Insurance Number' />
                  <input
                    type='text'
                    className='form-control PM-top-input'
                    defaultValue={quoteDetails?.customer_f_name + ' ' + quoteDetails?.customer_s_name}
                    disabled
                  />
                </div>
                <div className='PM-insurance-sub'>
                  <input type='text' className='form-control PM-insurance-input' placeholder='Insurance provider' />
                  <input
                    type='text'
                    className='form-control PM-insurance-date'
                    placeholder='Date of damage (dd-mm-yyyy)'
                  />
                </div>
                <input
                  id='autocomplete-field'
                  type='text'
                  className='form-control PM-address'
                  value={address}
                  onChange={handlePCodeChange}
                />
                <div className='PM-insurance-sub'>
                  <div className='PM-excess-cont'>
                    <span>Excess: </span>
                    <span> £</span>
                    <input
                      ref={excessRef}
                      type='text'
                      className='form-control'
                      value={excess}
                      onChange={updateExcess}
                    />
                  </div>
                  <div className='PM-insurance-doc-cont'>
                    <button>Choose</button>
                    <span>Upload insurance policy</span>
                  </div>
                </div>
              </div>
              <div className='PM-single-pay mt-3'>
                <button
                  className={`pm-proceed-btn card-btn ${
                    paymentMethodType === PaymentMethodType.STRIPE ? 'pm-proceed-selected' : ''
                  }`}
                  onClick={() => handleChangePaymentMethodType(PaymentMethodType.STRIPE)}
                >
                  <div className='position-relative w-100'>
                    <svg
                      className='p-Icon p-Icon--card Icon p-Icon--md p-TabIcon TabIcon'
                      role='presentation'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 16 16'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M0 4a2 2 0 012-2h12a2 2 0 012 2H0zm0 2v6a2 2 0 002 2h12a2 2 0 002-2V6H0zm3 5a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1z'
                      ></path>
                    </svg>
                  </div>
                  <span>Excess Card</span>
                </button>
                <button
                  className={`pm-proceed-btn ${
                    paymentMethodType === PaymentMethodType.CASH ? 'pm-proceed-selected' : ''
                  }`}
                  onClick={() => handleChangePaymentMethodType(PaymentMethodType.CASH)}
                >
                  <div className='position-relative w-100'>
                    <div className='p-TabIconContainer'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        className='p-Logo p-Logo--md p-TabIcon TabIcon'
                      >
                        <path
                          d='M12 0H4C1.79086 0 0 1.79086 0 4V12C0 14.2091 1.79086 16 4 16H12C14.2091 16 16 14.2091 16 12V4C16 1.79086 14.2091 0 12 0Z'
                          fill='url(#paint0_linear_867_1617)'
                        ></path>
                        <path
                          d='M8.40681 5.29776C9.17683 5.30047 9.92125 5.57452 10.5092 6.07176C10.5702 6.12709 10.65 6.15704 10.7323 6.15548C10.8146 6.15391 10.8932 6.12096 10.952 6.06336L11.552 5.45376C11.5824 5.42361 11.6063 5.38748 11.6221 5.34766C11.6379 5.30784 11.6453 5.26517 11.6439 5.22235C11.6424 5.17953 11.6321 5.13748 11.6136 5.09883C11.5951 5.06018 11.5688 5.02577 11.5364 4.99776C11.0614 4.59384 10.5124 4.28613 9.92001 4.09176L10.1096 3.19536C10.1191 3.14944 10.1182 3.102 10.107 3.05647C10.0958 3.01094 10.0746 2.96848 10.045 2.93216C10.0153 2.89585 9.97793 2.8666 9.93556 2.84653C9.8932 2.82647 9.84689 2.81609 9.80001 2.81616H8.62881C8.55631 2.81611 8.48597 2.84082 8.42945 2.88622C8.37292 2.93161 8.3336 2.99496 8.31801 3.06576L8.14761 3.86256C6.58761 3.93936 5.26761 4.70976 5.26761 6.28896C5.26761 7.65576 6.35841 8.24136 7.51161 8.64696C8.60241 9.05256 9.17841 9.20256 9.17841 9.77376C9.17841 10.345 8.60241 10.705 7.75401 10.705C6.93031 10.718 6.13457 10.4063 5.53881 9.83736C5.47942 9.77946 5.39976 9.74705 5.31681 9.74705C5.23386 9.74705 5.1542 9.77946 5.09481 9.83736L4.44321 10.4734C4.41283 10.5027 4.38867 10.5378 4.37217 10.5767C4.35567 10.6156 4.34717 10.6573 4.34717 10.6996C4.34717 10.7418 4.35567 10.7836 4.37217 10.8224C4.38867 10.8613 4.41283 10.8964 4.44321 10.9258C4.97338 11.4259 5.62149 11.7839 6.32721 11.9662L6.15201 12.8002C6.14253 12.8465 6.14331 12.8943 6.1543 12.9403C6.16528 12.9863 6.18621 13.0294 6.2156 13.0664C6.24499 13.1035 6.28213 13.1337 6.32442 13.1548C6.36672 13.176 6.41313 13.1876 6.46041 13.189H7.64001C7.71297 13.1898 7.78399 13.1654 7.84105 13.1199C7.89812 13.0745 7.93773 13.0107 7.95321 12.9394L8.12241 12.1402C9.98601 12.0202 11.1224 11.023 11.1224 9.55296C11.1224 8.20176 9.98481 7.63296 8.60241 7.16496C7.81401 6.87936 7.13241 6.68496 7.13241 6.09816C7.13241 5.51136 7.76961 5.29776 8.40681 5.29776Z'
                          fill='white'
                        ></path>
                        <defs>
                          <linearGradient
                            id='paint0_linear_867_1617'
                            x1='0'
                            y1='8'
                            x2='16'
                            y2='8'
                            gradientUnits='userSpaceOnUse'
                          >
                            <stop stopColor='#00C244'></stop>
                            <stop offset='1' stopColor='#00D64B'></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <span>Excess Cash</span>
                </button>
              </div>
              {!!paymentMethodType && (
                <Checkout paymentMethodType={paymentMethodType} amount={totalPrice} succeedPayment={refetchQuote} />
              )}
            </div>
          )}
          {selectedMethod === PaymentOptionEnum.SINGLE_PAY && (
            <div>
              <div className='PM-insurance-container'>
                <div className='d-flex justify-content-between'>
                  <button
                    className={
                      'btn-stroked blue round card' + (paymentMethodType === PaymentMethodType.STRIPE ? ' active' : '')
                    }
                    onClick={() => handleChangePaymentMethodType(PaymentMethodType.STRIPE)}
                  >
                    <span>Card</span>
                  </button>
                  <button
                    className={
                      'btn-stroked green round cash' + (paymentMethodType === PaymentMethodType.CASH ? ' active' : '')
                    }
                    onClick={() => handleChangePaymentMethodType(PaymentMethodType.CASH)}
                  >
                    <span>Cash</span>
                  </button>
                </div>
              </div>
              {!!paymentMethodType && (
                <Checkout paymentMethodType={paymentMethodType} amount={totalPrice} succeedPayment={refetchQuote} />
              )}

              {paymentMethodType === PaymentMethodType.CASH && (
                <div className='cash-payment-msg'>
                  Cash in hand payment. <br />
                  On the day of booking, technician will confirm the payment and we can start working.
                </div>
              )}
            </div>
          )}
          {selectedMethod === PaymentOptionEnum.NONE && <div className='transparent-element'>-</div>}
        </div>
      )}

      {showCashConfirm && (
        <ConfirmDialog
          title='I want to pay cash in hand'
          showIcon={false}
          onConfirm={handleConfirmCashType}
          onCancel={handleCancelCashType}
        />
      )}

      {showPaymentConfirm && (
        <ConfirmDialog
          title={
            tempPaymentMethodType === PaymentMethodType.CASH
              ? 'Cash in hand must be paid on the day of booking, before starting the work.'
              : 'Confirm payment method'
          }
          showIcon={false}
          confirmStr={tempPaymentMethodType === PaymentMethodType.CASH ? 'Ok' : 'Yes'}
          onConfirm={handleConfirmChangePaymentMethodType}
          onCancel={handleCancelChangePaymentMethodType}
        />
      )}

      {!!showEmailMissingPopup && (
        <ConfirmDialog
          title='Error'
          description='Add Email. Online payment will not be possible, when Email is missing.'
          showCancel={false}
          confirmStr='Ok'
          onConfirm={() => {
            setShowEmailMissingPopup(false)
            handleShowEmailMissing()
          }}
        />
      )}
    </div>
  )
}
