import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { FullScreenModal } from '@glass/components/FullScreenModal'
import { PaymentMethodType } from '@glass/enums'
import { Installments } from '@glass/pages/Installments'
import { updatePaymentMethod } from '@glass/services/apis/update-payment-method.service'
import { FourMonthsInstallment } from './FourMonthsInstallment'
import { FullPayment } from './FullPayment'
import { SixMonthsInstallment } from './SixMonthsInstallment'

export type PaymentMethodsProps = {
  paymentMethodType: PaymentMethodType
  totalPrice: number
  formError: string | boolean | undefined
  refetch: () => void
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethodType,
  totalPrice,
  formError,
  refetch,
}) => {
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
        <FourMonthsInstallment
          selected={paymentMethodType === PaymentMethodType.ASSIST_FOUR_PAYMENT}
          totalPrice={totalPrice}
          onSelect={() => handleConfirmChangePaymentMethodType(PaymentMethodType.ASSIST_FOUR_PAYMENT)}
        />
        <SixMonthsInstallment
          selected={paymentMethodType === PaymentMethodType.ASSIST_SIX_PAYMENT}
          totalPrice={totalPrice}
          onSelect={() => handleConfirmChangePaymentMethodType(PaymentMethodType.ASSIST_SIX_PAYMENT)}
        />
        <FullPayment
          selected={paymentMethodType === PaymentMethodType.STRIPE}
          totalPrice={totalPrice}
          onSelect={() => handleConfirmChangePaymentMethodType(PaymentMethodType.STRIPE)}
        />
        {/* <CashPayment
          selected={paymentMethodType === PaymentMethodType.CASH}
          totalPrice={totalPrice}
          onSelect={() => handleConfirmChangePaymentMethodType(PaymentMethodType.CASH)}
        /> */}
      </Box>

      <small className='form-error'>{formError}</small>

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
