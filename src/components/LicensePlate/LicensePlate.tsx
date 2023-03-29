import React, { useEffect, useRef, useState } from 'react'
import flag from '@glass/assets/icons/uk-flag.png'
import './license-plate.css'

export type LicensePlateProps = {
  licenseNumber: string
  model: string
  handleVehInputChange: (value: string | undefined) => void
  placeholderVal: string
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  licenseNumber,
  model,
  handleVehInputChange,
  placeholderVal,
}) => {
  const [licenseNum, setLicenseNum] = useState('')
  const licenseRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLicenseNum(licenseNumber)
  }, [licenseNumber])

  useEffect(() => {
    // format license number correctly
    if (Number.isInteger(Number(licenseNumber.charAt(2)))) {
      // license number is standard
      // check if plate already includes space
      if (licenseNumber.charAt(4) === ' ') {
        return
      } else if (licenseNumber.length === 7) {
        let input = licenseNumber
        input = input.slice(0, 4) + ' ' + input.slice(4)
        setLicenseNum(input)
      }
    }
  }, [])

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
              ref={licenseRef}
              autoFocus
              className='license-input'
              type='text'
              value={licenseNum}
              placeholder={placeholderVal}
              onChange={() => handleVehInputChange(licenseRef?.current?.value)}
              maxLength={8}
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
