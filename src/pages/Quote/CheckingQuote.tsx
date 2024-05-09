import React, { useState } from 'react'
import { Box, Link as MuiLink, Typography } from '@mui/material'
import { WindowSelector } from '@glass/components/WindowSelector'
import { PHONE_NUMBER } from '@glass/constants'
import { CarType } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import { Quote } from '@glass/models'

export type CheckingQuoteProps = {
  quoteDetails: Quote
}

export const CheckingQuote: React.FC<CheckingQuoteProps> = ({ quoteDetails }) => {
  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)

  useRetrieveVehData(quoteDetails?.DoorPlanLiteral, (data: CarType) => {
    setSelectedCarType(data)
  })

  return (
    <Box sx={{ paddingX: 3 }}>
      <Typography sx={{ textAlign: 'center', fontSize: '20px', fontWeight: '700', lineHeight: '130%' }}>
        {quoteDetails.customer_f_name}, our team is analyzing your inquiry for {quoteDetails.make} {quoteDetails.model}
      </Typography>
      <Box
        sx={{
          marginTop: 14,
          marginBottom: 6,
          height: 192,
          overflow: 'hidden',
        }}
      >
        <WindowSelector
          disabled={true}
          carType={selectedCarType}
          registrationNumber={quoteDetails.registration_number}
          selectedGlasses={quoteDetails.glass_location}
        />
      </Box>
      <Typography sx={{ textAlign: 'center', fontWeight: '700', lineHeight: '170%', letterSpacing: '-0.16px' }}>
        You will get your quote soon. Thank you for your patience.
      </Typography>
      <Typography
        sx={{
          color: 'var(--Gray-700, #474747)',
          textAlign: 'center',
          fontWeight: '400',
          lineHeight: '150%',
          letterSpacing: '-0.16px',
          marginTop: 4,
        }}
      >
        Need some more details?{' '}
        <MuiLink href={`tel:${PHONE_NUMBER}`} sx={{ color: 'var(--Light-Blue---Primary-400, #4285F4)' }}>
          Call us
        </MuiLink>
      </Typography>
    </Box>
  )
}
