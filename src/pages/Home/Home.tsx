import React, { useRef } from 'react'
import { useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import flag from '@glass/assets/icons/uk-flag.png'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const licenseRef = useRef<HTMLInputElement>(null)

  const patternMatch = () => {
    if (licenseRef.current) {
      licenseRef.current.value = formatLicenseNumber(licenseRef.current.value)
    }
  }

  const directToCustomer = () => {
    if (licenseRef.current?.value) {
      let licenseNum = licenseRef.current.value.toUpperCase()
      licenseNum = licenseNum.replace(' ', '')
      navigate('/customer/' + licenseNum)
    }
  }

  useEffect(() => {
    localStorage.setItem('development version', JSON.stringify('1.1.7'))
  }, [])

  return (
    <div>
      <section className='sec-banner-s1 my-4 my-md-5'>
        <div className='container'>
          <div className='banner-s1 position-relative'>
            <img src={process.env.PUBLIC_URL + '/img/bg-home.jpg'} className='img-fluid hp-quote-bg-img' alt='' />
            <div className='license-input-container'>
              <div className='yellow-box-home'>
                <div className='blue-box'>
                  <img className='flag' src={flag} alt='' />
                  <div className='gb'>UK</div>
                </div>
                <input
                  ref={licenseRef}
                  className='license-input'
                  type='text'
                  placeholder='NU71 REG'
                  onChange={patternMatch}
                  maxLength={8}
                />
              </div>
              <span className='input-group-text' id='basic-addon2'>
                <Button onClick={directToCustomer}>Get a Quote</Button>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
