import React from 'react'
import { Box, Radio, Typography } from '@mui/material'
import { QuotePackage } from '@glass/models'

export type PackagesProps = {
  packages: { [key: string]: QuotePackage }
  formError: string | boolean | undefined
  onCheckPackage: (value: number) => void
}

const MONTHS = 4

export const Packages: React.FC<PackagesProps> = ({ packages, formError, onCheckPackage }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          marginX: -4,
          padding: '8px 16px 12px',
          background: !!formError ? 'var(--Red---Semantic-000, #FEE8E8)' : 'transparent',
        }}
      >
        {Object.keys(packages).map((packageKey, index) => (
          <Box
            key={index}
            sx={{
              paddingX: 3,
              paddingY: 4,
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
              cursor: 'pointer',
            }}
            onClick={() => {
              onCheckPackage(packages[packageKey].quotation_package_id)
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Radio
                  checked={packages[packageKey].quotation_package_details[0]?.order_line_added}
                  size='small'
                  sx={{ padding: 0 }}
                />
                <Typography
                  sx={{
                    fontWeight: '600',
                    lineHeight: '20px',
                    letterSpacing: '-0.32px',
                    marginLeft: 2,
                  }}
                >
                  {packageKey.split('|')[0]}
                </Typography>
              </Box>
              <Typography
                sx={{
                  background: 'linear-gradient(90deg, #4522C2 0%, #8F00FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: '20px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  component='span'
                  sx={{
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.12)',
                    fontFamily: 'Inter',
                    fontSize: '18px',
                    fontWeight: '700',
                    lineHeight: '20px',
                    background: 'linear-gradient(90deg, #4522C2 0%, #8F00FF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  £
                </Typography>
                {+(packages[packageKey].quotation_package_price_total / MONTHS).toFixed(2)} Upfront
              </Typography>
            </Box>

            <Typography
              sx={{
                color: 'var(--Gray-700, #474747)',
                fontSize: '14px',
                lineHeight: '140%',
                marginTop: 4,
              }}
            >
              Then pay {MONTHS - 1}x£{+(packages[packageKey].quotation_package_price_total / MONTHS).toFixed(2)} a month
              or <strong>total £{+packages[packageKey].quotation_package_price_total.toFixed(2)}</strong> (inc VAT).
            </Typography>
          </Box>
        ))}
      </Box>

      <small className='form-error'>{formError}</small>
    </>
  )
}
