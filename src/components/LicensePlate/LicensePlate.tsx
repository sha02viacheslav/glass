import React, { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import flag from '@glass/assets/icons/uk-flag.png'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'
import './license-plate.css'

export type LicensePlateProps = {
  licenseNumber: string
  model?: string
  placeholderVal?: string
  showEdit?: boolean
  handleVehInputChange?: (value: string | undefined) => void
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  licenseNumber,
  model = '',
  placeholderVal = '',
  showEdit = true,
  handleVehInputChange = () => {},
}) => {
  const [localLicenseNum, setLocalLicenseNum] = useState('')

  const debouncedChangeHandler = useCallback(debounce(handleVehInputChange, 2000), [])

  const handleInputLicenseNum = (val: string) => {
    const licenseNum = formatLicenseNumber(val)
    setLocalLicenseNum(licenseNum)
    debouncedChangeHandler(licenseNum)
  }

  useEffect(() => {
    setLocalLicenseNum(formatLicenseNumber(licenseNumber))
  }, [licenseNumber])

  return (
    <div className='license-plate'>
      <div className='left-container'>
        <div className='yellow-box'>
          <div className='blue-box d-flex justify-content-center align-items-center'>
            <img className='flag' src={flag} alt='' />
            <div className='gb fw-b'>UK</div>
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
        <div className='mt-3'>
          <button className='btn-stroked round'>EDIT</button>
        </div>
      )}
    </div>
  )
}
