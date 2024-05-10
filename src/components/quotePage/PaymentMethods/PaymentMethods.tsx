import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { FullScreenModal } from '@glass/components/FullScreenModal'
import { PaymentMethodType } from '@glass/enums'
import { Installments } from '@glass/pages/Installments'
import { updatePaymentMethod } from '@glass/services/apis/update-payment-method.service'
import { CashPayment } from './CashPayment'
import { FourMonthsInstallment } from './FourMonthsInstallment'
import { FullPayment } from './FullPayment'
import { SixMonthsInstallment } from './SixMonthsInstallment'

export type PaymentMethodsProps = {
  paymentMethodType: PaymentMethodType
  totalPrice: number
  refetch: () => void
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethodType, totalPrice, refetch }) => {
  const { id: quoteId } = useParams()

  const [showInstallments, setShowInstallments] = useState<boolean>(false)

  const handleConfirmChangePaymentMethodType = (value: PaymentMethodType) => {
    if (quoteId) {
      trackPromise(
        updatePaymentMethod(quoteId, value).then((res) => {
          if (res.success) {
            refetch()
          }
        }),
      )
    }
  }

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
        <CashPayment
          selected={paymentMethodType === PaymentMethodType.CASH}
          totalPrice={totalPrice}
          onSelect={() => handleConfirmChangePaymentMethodType(PaymentMethodType.CASH)}
        />
      </Box>

      <Typography
        sx={{
          display: 'inline-flex',
          color: 'var(--Light-Blue---Primary-500, #225FC2)',
          fontWeight: '600',
          lineHeight: '150%',
          letterSpacing: '-0.16px',
          marginTop: 4,
          cursor: 'pointer',
        }}
        onClick={() => setShowInstallments(true)}
      >
        Why many of our customers choose not to claim insurance?
      </Typography>

      {showInstallments && (
        <FullScreenModal onClose={() => setShowInstallments(false)}>
          <Installments />
        </FullScreenModal>
      )}
    </>
  )
}
