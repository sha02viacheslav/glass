import './license-plate.css'
import React, { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type LicensePlateProps = {
  licenseNumber: string
  model?: string
  placeholderVal?: string
  showEdit?: boolean
  debounceTime?: number
  handleVehInputChange?: (value: string | undefined) => void
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  licenseNumber,
  model = '',
  placeholderVal = '',
  debounceTime = 0,
  showEdit = false,
  handleVehInputChange = () => {},
}) => {
  const [localLicenseNum, setLocalLicenseNum] = useState('')

  const debouncedChangeHandler = useCallback(debounce(handleVehInputChange, debounceTime), [])

  const handleInputLicenseNum = (val: string) => {
    const licenseNum = formatLicenseNumber(val)
    setLocalLicenseNum(licenseNum)
    if (!showEdit) {
      debouncedChangeHandler(licenseNum)
    }
  }

  const handleClickGetVehicle = () => {
    debouncedChangeHandler(localLicenseNum)
  }

  useEffect(() => {
    setLocalLicenseNum(formatLicenseNumber(licenseNumber))
  }, [licenseNumber])

  return (
    <div className='d-flex flex-column flex-md-row align-items-center align-items-md-start gap-md-3'>
      <div className='left-container'>
        <div className='yellow-box'>
          <div className='blue-box d-flex flex-column justify-content-end align-items-center'>
            <img src={process.env.PUBLIC_URL + '/images/uk-flag.svg'} className='img-fluid' alt='' />
            <div className='gb'>UK</div>
          </div>
          <input
            className='license-input'
            type='text'
            placeholder={placeholderVal}
            maxLength={8}
            value={localLicenseNum}
            onChange={(e) => handleInputLicenseNum(e.target.value)}
          />
        </div>
        {!!model && (
          <div className='fnt-14 fnt-md-16 text-grey mt-1'>
            <img src={process.env.PUBLIC_URL + '/img/car-sv.svg'} className='img-fluid me-2' alt='' />
            {model}
          </div>
        )}
      </div>
      {showEdit && (
        <div className='mt-3 w-100'>
          <button type='button' className='btn-stroked round w-100' onClick={() => handleClickGetVehicle()}>
            Get Vehicle Data
          </button>
        </div>
      )}
    </div>
  )
}
