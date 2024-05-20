import './Quote.css'
import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EnumLoader } from 'src/core/enums/loader.enum'
import { OrderState, PaymentMethodType, QuoteStep } from '@glass/enums'
import { useCalcPriceSummary } from '@glass/hooks/useCalcPriceSummary'
import { Quote } from '@glass/models'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { setQuoteId } from '@glass/utils/session/session.util'
import { NewQuote } from './NewQuote'
import { OpenQuote } from './OpenQuote'
import { QuoteCheckout } from './QuoteCheckout'
import { QuoteHeader } from './QuoteHeader'
import { QuoteInstallmentPayment } from './QuoteInstallmentPayment'
import { QuoteOptions } from './QuoteOptions'
import { QuoteStripePayment } from './QuoteStripePayment'
import { QuoteTracking } from './QuoteTracking'

export type QuoteProps = {
  quoteCount?: boolean
}

export const QuotePage: React.FC<QuoteProps> = ({ quoteCount = true }) => {
  const { id } = useParams()
  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [snapValue, setSnapValue] = useState<QuoteStep>(QuoteStep.NEW)
  const [seeQuoteClicked, setSeeQuoteClicked] = useState<boolean>(false)
  const [goToPaymentClicked, setGoToPaymentClicked] = useState<boolean>(false)

  const { totalPrice } = useCalcPriceSummary(quoteDetails)

  const getQuote = () => {
    if (id) {
      setQuoteId(id)
      trackPromise(
        getQuoteService(id, quoteCount).then((res) => {
          if (res.success) {
            setQuoteDetails(res.data)
          } else {
            toast(res.message)
          }
        }),
        EnumLoader.LOAD_QUOTE,
      )
    }
  }

  const initQuoteState = () => {
    if (quoteDetails?.order_state === OrderState.NEW) {
      setSnapValue(QuoteStep.NEW)
    } else if (quoteDetails?.order_state === OrderState.OPEN) {
      if (seeQuoteClicked) {
        setSnapValue(QuoteStep.OPTIONS)
      } else {
        setSnapValue(QuoteStep.OPEN)
      }
    } else if (quoteDetails?.order_state === OrderState.PAYMENT_IN_1H) {
      if (goToPaymentClicked) {
        setSnapValue(QuoteStep.PAYMENT)
      } else {
        setSnapValue(QuoteStep.CHECKOUT)
      }
    } else if (quoteDetails?.order_state === OrderState.PAYMENT_IN_1H_EXPIRED) {
      setSnapValue(QuoteStep.CHECKOUT)
    } else if (quoteDetails?.order_state === OrderState.WON) {
      setSnapValue(QuoteStep.TRACKING)
    }
  }

  useEffect(() => {
    // Get Quote Data
    if (id && !quoteDetails) {
      getQuote()
    }
  }, [quoteDetails])

  useEffect(() => {
    if (quoteDetails) {
      initQuoteState()
    }
  }, [quoteDetails, seeQuoteClicked, goToPaymentClicked])

  return (
    <>
      {!!id && <QuoteHeader quoteId={id} quoteStep={snapValue} quoteDetails={quoteDetails} />}

      <Box sx={{ paddingTop: 21 }}>
        {!!quoteDetails && (
          <>
            {snapValue === QuoteStep.NEW && <NewQuote quoteDetails={quoteDetails} />}

            {snapValue === QuoteStep.OPEN && (
              <OpenQuote quoteDetails={quoteDetails} onContinue={() => setSeeQuoteClicked(true)} />
            )}

            {snapValue === QuoteStep.OPTIONS && (
              <QuoteOptions
                quoteDetails={quoteDetails}
                refetch={() => {
                  getQuote()
                }}
              />
            )}

            {snapValue === QuoteStep.CHECKOUT && (
              <QuoteCheckout
                quoteDetails={quoteDetails}
                refetch={() => {
                  getQuote()
                }}
                onContinue={() => setGoToPaymentClicked(true)}
                onBack={() => setSnapValue(QuoteStep.OPTIONS)}
              />
            )}

            {snapValue === QuoteStep.PAYMENT && quoteDetails.payment_method_type === PaymentMethodType.STRIPE && (
              <QuoteStripePayment
                quoteDetails={quoteDetails}
                totalPrice={totalPrice}
                onBack={() => setGoToPaymentClicked(false)}
                onSucceed={() => getQuote()}
              />
            )}

            {snapValue === QuoteStep.PAYMENT &&
              (quoteDetails.payment_method_type === PaymentMethodType.ASSIST_FOUR_PAYMENT ||
                quoteDetails.payment_method_type === PaymentMethodType.ASSIST_SIX_PAYMENT ||
                quoteDetails.payment_method_type === PaymentMethodType.ASSIST_TWELVE_PAYMENT) && (
                <QuoteInstallmentPayment quoteDetails={quoteDetails} onBack={() => setGoToPaymentClicked(false)} />
              )}

            {snapValue === QuoteStep.TRACKING && <QuoteTracking quoteDetails={quoteDetails} />}
          </>
        )}
      </Box>
    </>
  )
}
