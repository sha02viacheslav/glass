import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FullScreenModal } from '@glass/components/FullScreenModal'
import { PaymentMethodType } from '@glass/enums'
import { Installments } from '@glass/pages/Installments'
import { CashPayment } from './CashPayment'
import { FourMonthsInstallment } from './FourMonthsInstallment'
import { FullPayment } from './FullPayment'
import { SixMonthsInstallment } from './SixMonthsInstallment'

export type PaymentMethodsProps = {
  paymentMethodType: PaymentMethodType
  totalPrice: number
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethodType, totalPrice }) => {
  const [showComparison, setShowComparison] = useState<boolean>(false)

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FourMonthsInstallment
          selected={paymentMethodType === PaymentMethodType.ASSIST_FOUR_PAYMENT}
          totalPrice={totalPrice}
        />
        <SixMonthsInstallment
          selected={paymentMethodType === PaymentMethodType.ASSIST_SIX_PAYMENT}
          totalPrice={totalPrice}
        />
        <FullPayment selected={paymentMethodType === PaymentMethodType.STRIPE} totalPrice={totalPrice} />
        <CashPayment selected={paymentMethodType === PaymentMethodType.CASH} totalPrice={totalPrice} />
      </Box>

      <Typography
        sx={{
          color: 'var(--Light-Blue---Primary-500, #225FC2)',
          fontWeight: '600',
          lineHeight: '150%',
          letterSpacing: '-0.16px',
          marginTop: 4,
          a: {
            textDecoration: 'none',
          },
        }}
        onClick={() => setShowComparison(true)}
      >
        Why many of our customers choose not to claim insurance?
      </Typography>

      {showComparison && (
        <FullScreenModal onClose={() => setShowComparison(false)}>
          <Installments />
        </FullScreenModal>
      )}
    </>
  )
}
