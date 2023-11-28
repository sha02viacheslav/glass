import React, { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import flag from '@glass/assets/icons/uk-flag.png'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import './license-plate.css'

export type LicensePlateProps = {
  licenseNumber: string
  model: string
  placeholderVal: string
  handleVehInputChange: (value: string | undefined) => void
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  licenseNumber,
  model,
  placeholderVal,
  handleVehInputChange,
}) => {
  const [localLicenseNum, setLocalLicenseNum] = useState('')

  const debouncedChangeHandler = useCallback(debounce(handleVehInputChange, 2000), [])

  useEffect(() => {
    setLocalLicenseNum(formatLicenseNumber(localLicenseNum))
    debouncedChangeHandler(localLicenseNum)
  }, [localLicenseNum])

  useEffect(() => {
    setLocalLicenseNum(formatLicenseNumber(licenseNumber))
  }, [licenseNumber])

  return (
    <div className='center'>
      <div className='license-plate'>
        <div className='left-container'>
          <div className='yellow-box'>
            <div className='blue-box'>
              <img className='flag' src={flag} alt='' />
              <div className='gb'>UK</div>
            </div>
            <input
              autoFocus
              className='license-input'
              type='text'
              placeholder={placeholderVal}
              maxLength={8}
              value={localLicenseNum}
              onChange={(e) => setLocalLicenseNum(e.target.value)}
            />
          </div>
          <p className='fw-500 mb-0 ms-2'>
            <img src={process.env.PUBLIC_URL + '/img/car-sv.svg'} className='img-fluid me-2' alt='' />
            {model}
          </p>
        </div>
        <div className='right-container'>
          <button className='edit-btn'>EDIT</button>
        </div>
      </div>
    </div>
  )
}
