import React from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { QuickCall } from '@glass/components/QuickCall/QuickCall'
import { PaymentMethodType, QuoteStep } from '@glass/enums'
import { Quote } from '@glass/models'
import { ShareQuote } from './ShareQuote'

export type QuoteHeaderProps = {
  quoteId: string
  quoteStep: QuoteStep
  quoteDetails: Quote | undefined
}

export const QuoteHeader: React.FC<QuoteHeaderProps> = ({ quoteId, quoteStep, quoteDetails }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: { lg: '100px' },
        zIndex: '1001',
        display: 'flex',
        alignItems: { xs: 'center', lg: 'flex-end' },
        justifyContent: 'space-between',
        padding: { xs: '18px 16px 10px', lg: '18px 0 20px' },
        borderBottom: '2px solid var(--Gray-100, #F2F2F3)',
        background: '#fff',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: { xs: 'center', lg: 'flex-end' }, justifyContent: 'space-between' }}
        className='container'
      >
        <Link to='/'>
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: { xs: 22, lg: 32 }, cursor: 'pointer' }}
            image={process.env.PUBLIC_URL + '/images/logo.png'}
          />
        </Link>

        {quoteStep !== QuoteStep.TRACKING && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', lg: 'column' },
              alignItems: { xs: 'center', lg: 'flex-end' },
              gap: { xs: 2, lg: 0 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 16, lg: 24 },
                color: 'var(--Gray-600, #6A6B71)',
                fontWeight: '700',
                lineHeight: { xs: '22px', lg: '34px' },
              }}
            >
              {quoteStep === QuoteStep.NEW && 'Waiting for quote'}
              {(quoteStep === QuoteStep.OPEN || quoteStep === QuoteStep.OPTIONS) && 'Quote is ready!'}
              {quoteStep === QuoteStep.CHECKOUT && 'Payment option'}
              {quoteStep === QuoteStep.PAYMENT &&
                quoteDetails?.payment_method_type === PaymentMethodType.STRIPE &&
                'Card details'}
              {quoteStep === QuoteStep.PAYMENT &&
                (quoteDetails?.payment_method_type === PaymentMethodType.ASSIST_FOUR_PAYMENT ||
                  quoteDetails?.payment_method_type === PaymentMethodType.ASSIST_SIX_PAYMENT ||
                  quoteDetails?.payment_method_type === PaymentMethodType.ASSIST_TWELVE_PAYMENT) &&
                'Installment plan details'}
            </Typography>
            <QuickCall />
          </Box>
        )}

        {quoteStep === QuoteStep.TRACKING && (
          <Box sx={{ display: { lg: 'none' } }}>
            <ShareQuote url={`${process.env.PUBLIC_URL}/quote/${quoteId}`} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
