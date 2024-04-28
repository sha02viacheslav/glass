import './QuickContact.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LicensePlate } from '@glass/components/LicensePlate'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type FooterProps = {
  showReg?: boolean
}

export const QuickContact: React.FC<FooterProps> = ({ showReg = true }) => {
  const navigate = useNavigate()
  const [licenseSearchVal, setLicense] = useState('')

  const handleVehInputChange = (data: string | undefined) => {
    setLicense(formatLicenseNumber(data))
  }

  const directToCustomer = () => {
    navigate('/customer/' + licenseSearchVal)
    setLicense('')
  }

  return (
    <section className='footer-top'>
      <div className='row'>
        <div className='col-lg-7 offset-lg-5'>
          <div className='title'>Get a Free Quote Now</div>
          <div className='description'>
            Enter your vehicle registration to get an immediate quote. We have 0% monthly installments available.
            Starting at only £83 per month!
          </div>

          {showReg && (
            <div className='mt-4'>
              <div className='d-flex flex-column flex-md-row align-items-center'>
                <LicensePlate
                  placeholderVal='Enter reg.'
                  licenseNumber={licenseSearchVal}
                  showEdit={false}
                  handleVehInputChange={handleVehInputChange}
                />
                <button onClick={directToCustomer} className='btn-raised col-12 col-md-auto mt-25'>
                  Get a quote for your car
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
