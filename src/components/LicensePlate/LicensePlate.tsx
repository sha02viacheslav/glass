import './license-plate.css'
import React, { useEffect, useMemo, useState } from 'react'
import { VehicleData } from '@glass/models'
import { getVehicleService } from '@glass/services/apis/get-vehicle.service'
import { formatLicenseNumber } from '@glass/utils/format-license-number/format-license-number.util'

export type LicensePlateProps = {
  licenseNumber?: string
  placeholderVal?: string
  showSearch?: boolean
  showModel?: boolean
  debounceTime?: number
  handleVehInputChange?: (value: string) => void
  handleVehicleDataChange?: (value: VehicleData | undefined) => void
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
  const [vehData, setVehData] = useState<VehicleData | undefined>()

  const model = useMemo(() => (!!vehData ? vehData.Make + ' ' + vehData.Model : ''), [vehData])
  const vehicleImageUrl = useMemo(() => vehData?.vehicle_image_url || '', [vehData])

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
        getVehicleService(license)
          .then((res) => {
            if (res.success && res.data?.Model) {
              handleVehicleDataChange(res.data)
              setVehData(res.data)
            } else {
              setInvalid(true)
              handleVehicleDataChange(undefined)
              setVehData(undefined)
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
    setLocalLicenseNum(formatLicenseNumber(licenseNumber))
  }, [licenseNumber])

  return (
    <div className={'license-plate' + (invalid ? ' invalid' : '')}>
      <div className='yellow-box'>
        <div className='blue-box'>
          <img src={process.env.PUBLIC_URL + '/images/uk-flag.svg'} className='flag' alt='' />
          <div className='gb'>UK</div>
        </div>
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
      </div>

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
