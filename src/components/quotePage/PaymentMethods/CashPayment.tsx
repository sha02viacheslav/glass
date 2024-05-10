import React, { useState } from 'react'
import { Box, CardMedia, Radio, Typography } from '@mui/material'
import { ConfirmDialog } from '@glass/components/ConfirmDialog'

export type CashPaymentProps = {
  selected: boolean
  totalPrice: number
  onSelect: () => void
}

export const CashPayment: React.FC<CashPaymentProps> = ({ selected, totalPrice, onSelect }) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  return (
    <>
      <Box
        sx={{
          paddingX: 3,
          paddingY: 4,
          borderRadius: '4px',
          background: '#FFF',
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        }}
        onClick={() => {
          if (!selected) setShowConfirm(true)
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Radio checked={selected} size='small' sx={{ padding: 0 }} />
            <Typography
              sx={{
                fontSize: '18px',
                lineHeight: '20px',
                letterSpacing: '-0.18px',
                marginLeft: 2,
              }}
            >
              Pay in cash (Total inc. VAT <strong>£{totalPrice}</strong>)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 3, marginBottom: 4 }}>
          <CardMedia
            component='img'
            sx={{ width: 20, height: 20 }}
            image={process.env.PUBLIC_URL + '/images/alert-rhombus.svg'}
          />
          <Typography
            sx={{
              color: 'var(--Gray-700, #474747)',
              fontSize: '14px',
              lineHeight: '170%',
            }}
          >
            Please note that if you choose the &apos;pay in cash&apos; option, payment must be made before the
            technician begins work.
          </Typography>
        </Box>
      </Box>

      {showConfirm && (
        <ConfirmDialog
          title='How pay in cash works?'
          showIcon={false}
          description={
            <span className='text-left d-block'>
              Payment in cash requires you to pay to technician before he begins work. Please keep the exact amount
              ready as your technician may not have the required change <br /> Please select{' '}
              <strong>&apos;I agree&apos;</strong> to confirm, or &apos;Disagree&apos; if you cannot comply.
            </span>
          }
          confirmStr='I agree'
          cancelStr='Disagree'
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false)
            onSelect()
          }}
        />
      )}
    </>
  )
}
