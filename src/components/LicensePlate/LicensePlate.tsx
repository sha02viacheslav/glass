import './license-plate.css'
import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { Inquiry } from '@glass/models'
import { getInquiryService } from '@glass/services/apis/get-inquiry.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type LicensePlateProps = {
  licenseNumber?: string
  placeholderVal?: string
  showSearch?: boolean
  showModel?: boolean
  debounceTime?: number
  handleVehInputChange?: (value: string) => void
  handleVehicleDataChange?: (value: Inquiry | undefined) => void
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  licenseNumber = '',
  placeholderVal = '',
  showSearch = false,
  showModel = false,
  handleVehInputChange = () => {},
  handleVehicleDataChange = () => {},
}) => {
  const [localLicenseNum, setLocalLicenseNum] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [invalid, setInvalid] = useState<boolean>(false)
  const [inquiry, setInquiry] = useState<Inquiry | undefined>()

  const model = useMemo(() => (!!inquiry ? inquiry.Make + ' ' + inquiry.Model : ''), [inquiry])
  const vehicleImageUrl = useMemo(() => inquiry?.step_1?.vehicle_image_url || '', [inquiry])

  const handleInputLicenseNum = (val: string) => {
    const licenseNum = formatLicenseNumber(val)
    setLocalLicenseNum(licenseNum)

    if (handleVehInputChange) {
      handleVehInputChange(licenseNum)
    }
  }

  const handleClickSearch = () => {
    fetchVehData(localLicenseNum)
  }

  const fetchVehData = (license: string | undefined) => {
    if (!!license && !isLoading) {
      // fetch vehicle data
      setInvalid(false)
      setIsLoading(true)
      setTimeout(() => {
        getInquiryService(license)
          .then((res) => {
            if (res.success && res.data?.Model) {
              handleVehicleDataChange(res.data)
              setInquiry(res.data)
            } else {
              setInvalid(true)
              handleVehicleDataChange(undefined)
              setInquiry(undefined)
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false)
          })
      })
    }
  }

  useEffect(() => {
    const formattedLicenseNumber = formatLicenseNumber(licenseNumber)
    if (formattedLicenseNumber !== localLicenseNum) {
      fetchVehData(formattedLicenseNumber)
      setLocalLicenseNum(formattedLicenseNumber)
    }
  }, [licenseNumber])

  return (
    <div className={'license-plate' + (invalid ? ' invalid' : '')}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          minWidth: '312px',
          borderRadius: '2px',
          textAlign: 'center',
          verticalAlign: 'middle',
          border: invalid ? '1px solid var(--Red---Semantic-500, #c22222)' : '1px solid #000',
        }}
      >
        <Box
          sx={{
            padding: '4px 8px',
            borderRadius: '2px 0 0 2px',
            background: '#1165b3',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <img src={process.env.PUBLIC_URL + '/images/uk-flag.svg'} width='20' alt='' />
          <Box
            sx={{
              fontSize: '14px',
              lineHeight: '24px',
              fontWeight: '700',
              letterSpacing: '-0.14px',
              color: 'var(--white-color)',
            }}
          >
            UK
          </Box>
        </Box>
        <input
          className={'license-input' + (showSearch ? ' with-search' : '')}
          type='text'
          placeholder={placeholderVal}
          maxLength={8}
          value={localLicenseNum}
          onChange={(e) => handleInputLicenseNum(e.target.value)}
          disabled={isLoading}
        />

        {showSearch && (
          <button className='search-button' onClick={() => handleClickSearch()} disabled={isLoading}>
            <img src={process.env.PUBLIC_URL + '/images/search.svg'} className='img-fluid' alt='' />
          </button>
        )}
      </Box>

      {!!showModel && (
        <div>
          <div className='model'>
            <img
              src={process.env.PUBLIC_URL + '/images/' + (invalid ? 'car-red.svg' : 'car.svg')}
              className='img-fluid'
              alt=''
            />
            <div>
              {invalid
                ? 'We did not find your car'
                : isLoading
                ? 'Searching for your car'
                : !!model
                ? model
                : 'Car make and model will be shown here '}
            </div>
          </div>
          <div className='d-flex justify-content-between gap-3'>
            <div className='search-hint'>
              {!!model
                ? 'We found your car model and make.'
                : invalid
                ? 'Please make sure you entered the correct registration number.'
                : isLoading
                ? 'Hang tight while we find your model.'
                : 'Needs few seconds to find your car after you type your registration number.'}
            </div>

            {!!vehicleImageUrl && <img src={vehicleImageUrl} className='car-image' alt='' />}
          </div>
        </div>
      )}
    </div>
  )
}
