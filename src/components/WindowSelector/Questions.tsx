import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Characteristic } from '@glass/models'
import { QuestionCard } from './QuestionCard'

export type QuestionsProps = {
  characteristics: Characteristic[]
  onChange: (value: Characteristic[]) => void
  setActiveIndex?: (v: number) => void
}

export const Questions: React.FC<QuestionsProps> = ({ characteristics, onChange, setActiveIndex }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const handleChangeCharacteristic = (value: Characteristic) => {
    onChange(
      characteristics.map((item) => {
        if (item.id === value.id) {
          return value
        }
        return item
      }),
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 4 }}>
        <Typography
          sx={{
            color: 'var(--Gray-600, #6A6B71)',
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '24px',
            letterSpacing: '-0.16px',
          }}
        >
          Question{' '}
          <Typography sx={{ display: 'inline', color: 'var(--Gray-800, #14151F)' }} component='span'>
            {currentIndex + 1}
          </Typography>
          /{characteristics.length}
        </Typography>

        <Box sx={{ display: 'flex', gap: 5 }}>
          <img
            src={process.env.PUBLIC_URL + '/images/chevron-left-gray.svg'}
            onClick={() => {
              const newValue = (currentIndex + 1) % characteristics.length
              setCurrentIndex(newValue)
              if (setActiveIndex) {
                setActiveIndex(newValue)
              }
            }}
          />
          <img
            src={process.env.PUBLIC_URL + '/images/chevron-right-gray.svg'}
            onClick={() =>
              setCurrentIndex((prev) => {
                const newValue = (characteristics.length + prev - 1) % characteristics.length
                if (setActiveIndex) {
                  setActiveIndex(newValue)
                }
                return newValue
              })
            }
          />
        </Box>
      </Box>

      <QuestionCard
        characteristic={characteristics[currentIndex]}
        onChange={(value) => handleChangeCharacteristic(value)}
      ></QuestionCard>
    </>
  )
}
