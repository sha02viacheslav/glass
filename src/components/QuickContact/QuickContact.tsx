import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        pt: { xs: 12, lg: 16 },
        px: 4,
        pb: { xs: 8, lg: 16 },
        borderTop: '1px solid var(--Light-Blue---Primary-600, #133f85)',
        background: 'var(--Light-Blue---Primary-800, #020e21)',
      }}
      className='footer-top'
    >
      <Box
        sx={{
          width: '260px',
          height: '64px',
          position: 'absolute',
          top: { xs: '12px', lg: '16px' },
          left: '50%',
          transform: 'translateX(calc(-50% - 8px))',
          background:
            'linear-gradient(180deg, rgba(2, 14, 33, 0) 0%, rgba(2, 14, 33, 1) 55%, rgba(2, 14, 33, 1) 100%), url(/images/footer-logo.svg) center / contain no-repeat',
        }}
      />
      <Typography
        sx={{
          color: 'var(--Light-Blue---Primary-000, #e8f0fe)',
          textAlign: 'center',
          fontSize: { xs: 24, lg: 30 },
          fontWeight: '600',
          lineHeight: '28px',
          position: 'inherit',
        }}
      >
        {showReg ? 'Get a Free Quote Now' : 'We are here for you!'}
      </Typography>
      <Typography
        sx={{
          color: 'var(--Gray-100, #f2f2f3)',
          textAlign: 'center',
          lineHeight: '24px',
          marginTop: { xs: 2, lg: 4 },
          maxWidth: 619,
        }}
      >
        {showReg
          ? 'Enter your vehicle registration to get an immediate quote. We have 0% monthly installments available. Starting at only £83 per month!'
          : 'You can call us if you have any questions.'}
      </Typography>

      {showReg ? (
        <Box sx={{ mt: { xs: 6, lg: 8 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 358 }}>
            <LicensePlate
              placeholderVal='Enter reg.'
              licenseNumber={licenseSearchVal}
              showSearch={false}
              handleVehInputChange={handleVehInputChange}
            />
            <button onClick={directToCustomer} className='btn-raised w-100 mt-25'>
              Get a quote for your car
            </button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              gap: '8px',
              color: 'var(--Light-Blue---Primary-400, #4285f4)',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: '24px',
              letterSpacing: '-0.18px',
              cursor: 'pointer',
              marginTop: '24px',
            }}
          >
            <img src={process.env.PUBLIC_URL + '/images/call.svg'} /> Call us
          </Box>
        </Box>
      )}
    </Box>
  )
}
