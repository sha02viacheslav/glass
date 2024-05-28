import React, { useMemo } from 'react'
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { CharacteristicAnswer } from '@glass/enums'
import { Characteristic } from '@glass/models'

export type QuestionCardProps = {
  characteristic: Characteristic
  disabled?: boolean
  onChange: (value: Characteristic) => void
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ characteristic, disabled = false, onChange }) => {
  const answer = useMemo(() => {
    if (characteristic[CharacteristicAnswer.YES]) {
      return CharacteristicAnswer.YES
    } else if (characteristic[CharacteristicAnswer.NO]) {
      return CharacteristicAnswer.NO
    } else if (characteristic[CharacteristicAnswer.NOT_KNOW]) {
      return CharacteristicAnswer.NOT_KNOW
    } else {
      return undefined
    }
  }, [characteristic])

  return (
    <>
      <Box
        sx={{
          padding: { xs: '12px', lg: '16px' },
          borderRadius: '2px',
          boxShadow:
            '0px 4px 17px 0px rgba(147, 147, 147, 0.04), 0px 2px 12px 0px rgba(147, 147, 147, 0.07), 0px 1px 7px 0px rgba(147, 147, 147, 0.09)',
          background: '#fff',
        }}
      >
        <Typography
          sx={{
            color: 'ar(--Gray-800, #14151F)',
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '150%',
            letterSpacing: '-0.16px',
          }}
        >
          {characteristic.name}
        </Typography>
        <RadioGroup
          row
          value={answer}
          onChange={(_, value) =>
            onChange({
              ...characteristic,
              [CharacteristicAnswer.YES]: false,
              [CharacteristicAnswer.NO]: false,
              [CharacteristicAnswer.NOT_KNOW]: false,
              [value]: true,
            })
          }
          sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}
        >
          <FormControlLabel value={CharacteristicAnswer.YES} control={<Radio />} label='Yes' disabled={disabled} />
          <FormControlLabel value={CharacteristicAnswer.NO} control={<Radio />} label='No' disabled={disabled} />
          <FormControlLabel
            value={CharacteristicAnswer.NOT_KNOW}
            control={<Radio />}
            label="I don't know"
            disabled={disabled}
          />
        </RadioGroup>
      </Box>
    </>
  )
}
