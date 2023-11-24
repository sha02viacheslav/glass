import './GetQuoteOrCall.css'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PHONE_NUMBER } from '@glass/constants'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type GetQuoteOrCallProps = {
  showRegInput?: boolean
}

export const GetQuoteOrCall: React.FC<GetQuoteOrCallProps> = ({ showRegInput = true }) => {
  const navigate = useNavigate()
  const licenseRef = useRef<HTMLInputElement>(null)

  const patternMatch = () => {
    if (licenseRef.current) {
      licenseRef.current.value = formatLicenseNumber(licenseRef.current.value)
    }
  }

  const directToCustomer = () => {
    if (licenseRef.current?.value) {
      navigate('/customer/' + licenseRef.current?.value)
      licenseRef.current.value = ''
    } else {
      navigate('/customer')
    }
  }

  return (
    <div className='d-flex align-items-center justify-content-center gap-3'>
      {showRegInput && (
        <div className='reg-input-wrap'>
          <div className='form-group'>
            <input
              ref={licenseRef}
              type='text'
              className='form-control'
              placeholder='Reg Number'
              onChange={patternMatch}
              maxLength={8}
            />
          </div>
        </div>
      )}
      <div className='d-flex align-items-center justify-content-center'>
        <button type='submit' className='btn-raised round' onClick={directToCustomer}>
          GET A QUOTE
        </button>
        <div className='or-call m-3'>or call</div>
        <a href={`tel:${PHONE_NUMBER}`} className='purple-phone-number'>
          {PHONE_NUMBER}
        </a>
      </div>
    </div>
  )
}
