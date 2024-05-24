import './license-plate.css'
import React, { useEffect, useMemo, useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Inquiry } from '@glass/models'
import { getInquiryService } from '@glass/services/apis/get-inquiry.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type LicensePlateProps = {
  disabled?: boolean
  licenseNumber?: string
  placeholderVal?: string
  showSearch?: boolean
  showModel?: boolean
  hasError?: boolean
  handleVehInputChange?: (value: string) => void
  handleVehicleDataChange?: (value: Inquiry | undefined) => void
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  disabled = false,
  licenseNumber = '',
  placeholderVal = '',
  showSearch = false,
  showModel = false,
  hasError = false,
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
    getInquiry(localLicenseNum)
  }

  const getInquiry = (license: string | undefined) => {
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
      if (!disabled) {
        getInquiry(formattedLicenseNumber)
      }
      setLocalLicenseNum(formattedLicenseNumber)
    }
  }, [licenseNumber])

  return (
    <Box className='license-plate'>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          minWidth: '312px',
          borderRadius: '2px',
          textAlign: 'center',
          verticalAlign: 'middle',
          border: invalid || hasError ? '1px solid var(--Red---Semantic-500, #c22222)' : '1px solid #000',
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
          disabled={isLoading || disabled}
        />

        {showSearch && (
          <button className='search-button' onClick={() => handleClickSearch()} disabled={isLoading}>
            <img src={process.env.PUBLIC_URL + '/images/search.svg'} className='img-fluid' alt='' />
          </button>
        )}
      </Box>

      {!!showModel && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mt: { xs: 2, lg: 3 } }}>
            <CardMedia
              component='img'
              sx={{ width: { xs: 24, lg: 32 }, height: { xs: 24, lg: 32 } }}
              image={process.env.PUBLIC_URL + '/images/' + (invalid || hasError ? 'car-red.svg' : 'car.svg')}
              className='img-fluid'
              alt=''
            />
            <Typography
              sx={{
                color: invalid || hasError ? 'var(--Red---Semantic-500, #c22222)' : 'var(--WF-Base-800, #2d3648)',
                fontSize: { xs: 16, lg: 20 },
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: '150%',
                letterSpacing: '-0.16px',
              }}
            >
              {invalid || hasError
                ? 'We  did not find your car'
                : isLoading
                ? 'Searching for your car'
                : !!model
                ? model
                : 'Car make and model will be shown here '}
            </Typography>
          </Box>

          <Box className='d-flex justify-content-between gap-3'>
            <Typography
              sx={{
                color: invalid || hasError ? 'var(--Red---Semantic-500, #c22222)' : 'var(--WF-Base-600, #717d96)',
                fontSize: { xs: 14, lg: 16 },
                lineHeight: '150%',
                marginTop: 1,
              }}
            >
              {!!model
                ? 'We found your car model and make.'
                : invalid || hasError
                ? 'Please make sure you entered the correct registration number.'
                : isLoading
                ? 'Hang tight while we find your model.'
                : 'Needs few seconds to find your car after you type your registration number.'}
            </Typography>

            {!!vehicleImageUrl && (
              <CardMedia
                component='img'
                sx={{ width: 90, height: 'auto', objectFit: 'contain' }}
                image={vehicleImageUrl}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
