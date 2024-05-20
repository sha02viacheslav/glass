import React, { useEffect, useState } from 'react'
import { Box, CardMedia, Typography } from '@mui/material'
import { useFormik } from 'formik'
import moment from 'moment'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { EnumLoader } from 'src/core/enums/loader.enum'
import { object, string } from 'yup'
import { PaymentCards } from '@glass/components/PaymentCards'
import { PaymentMethods } from '@glass/components/quotePage/PaymentMethods'
import { SLOT_LEGENDS } from '@glass/constants'
import { useCalcPriceSummary } from '@glass/hooks/useCalcPriceSummary'
import { Quote } from '@glass/models'
import { resetQuoteService } from '@glass/services/apis/reset-quote.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import {
  bookingEndTime,
  bookingStartTime,
  scrollToElementWithOffset,
  slotStartTime,
  slotTimeIndex,
  workingPlaceLabel,
} from '@glass/utils/index'
import { ExpiredDialog } from './ExpiredDialog'

export type QuoteCheckoutForm = {
  paymentMethodType: boolean
}

export enum FormFieldIds {
  PAYMENT_METHOD_TYPE = 'paymentMethodType',
}

export type QuoteCheckoutProps = {
  quoteDetails: Quote
  refetch: () => void
  onContinue: () => void
  onBack: () => void
}

export const QuoteCheckout: React.FC<QuoteCheckoutProps> = ({ quoteDetails, refetch, onContinue, onBack }) => {
  const { id: quoteId } = useParams()

  const validationSchema = object({
    paymentMethodType: string().required('Please select the payment method').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      paymentMethodType: false,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
  })

  const { totalPrice } = useCalcPriceSummary(quoteDetails)

  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [timerBg, setTimerBg] = useState<string>('')
  const [formattedTime, setFormattedTime] = useState<string>('')

  const handleContinueClick = () => {
    formik.setFieldTouched(FormFieldIds.PAYMENT_METHOD_TYPE, true, true)
    if (formik.errors.paymentMethodType) {
      scrollToElementWithOffset(FormFieldIds.PAYMENT_METHOD_TYPE, 100)
      return
    }
    onContinue()
  }

  const handleClickReset = () => {
    if (!quoteId) return
    trackPromise(
      resetQuoteService(quoteId).then((res) => {
        if (res.success) {
          refetch()
        }
      }),
      EnumLoader.RESET_QUOTE,
    )
  }

  const getCountDownColor = () => {
    const endDate = moment.utc(quoteDetails.payment_in_1h_end_date)
    const now = moment()
    const diffInSeconds = endDate.diff(now, 'seconds')

    const minutes = Math.floor(diffInSeconds / 60)
    const seconds = diffInSeconds % 60

    setFormattedTime(`${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`)

    setTimeLeft(diffInSeconds)

    if (diffInSeconds > 1800) {
      setTimerBg('var(--Light-Blue---Primary-000, #E8F0FE)')
    } else if (diffInSeconds > 600) {
      setTimerBg('FFF7B2')
    } else {
      setTimerBg('var(--Red---Semantic-000, #FEE8E8)')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getCountDownColor()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (quoteDetails) {
      formik.setFieldValue(FormFieldIds.PAYMENT_METHOD_TYPE, quoteDetails.payment_method_type)
    }
  }, [quoteDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <form>
      <Box sx={{ paddingX: 4, marginBottom: 40 }}>
        {timeLeft < 0 ? (
          <ExpiredDialog
            quoteDetails={quoteDetails}
            onConfirm={() => {
              handleClickReset()
            }}
          ></ExpiredDialog>
        ) : (
          <Box
            sx={{
              p: 3,
              background: timerBg,
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: '14px', lineHeight: '100%', letterSpacing: '-0.14px' }}>
              We are keeping your booked slot reserved.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <CardMedia sx={{ width: 24, height: 24 }} image={process.env.PUBLIC_URL + '/images/timer-black.svg'} />
              <Typography sx={{ fontWeight: '700', lineHeight: '150%', letterSpacing: '-0.16px' }}>
                {formattedTime} left
              </Typography>
            </Box>
          </Box>
        )}
        <Box sx={{ paddingX: 3, py: 4, borderRadius: '2px', background: '#fff' }}>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6A6B71)',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '150%',
              letterSpacing: '0.84px',
              marginBottom: 4,
            }}
          >
            OVERVIEW
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CardMedia
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/car-windshield.svg'}
                />
                <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '140%' }}>
                  Repair type
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '14px', lineHeight: '140%' }}>
                {quoteDetails?.order_lines?.[0]?.product}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CardMedia sx={{ width: 20, height: 20 }} image={process.env.PUBLIC_URL + '/images/wrench.svg'} />
                <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '140%' }}>
                  Mobile service
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '14px', lineHeight: '140%' }}>
                {workingPlaceLabel(quoteDetails.working_place)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CardMedia sx={{ width: 20, height: 20 }} image={process.env.PUBLIC_URL + '/images/calendar.svg'} />
                <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '140%' }}>
                  Repair date and time
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '14px', lineHeight: '140%' }}>
                {moment(quoteDetails.booking_date).format('dddd, DD.MM.')}{' '}
                <Typography component='span' sx={{ fontSize: '14px', lineHeight: '140%', textTransform: 'capitalize' }}>
                  {SLOT_LEGENDS[slotTimeIndex(slotStartTime(quoteDetails.booking_date, quoteDetails.time_slot))]?.title}
                </Typography>{' '}
                ({moment(bookingStartTime(quoteDetails.booking_date, quoteDetails.time_slot)).format('h:mm a')} -{' '}
                {moment(bookingEndTime(quoteDetails.booking_date, quoteDetails.time_slot)).format('h:mm a')})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CardMedia
                  sx={{ width: 20, height: 20 }}
                  image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
                />
                <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', fontSize: '14px', lineHeight: '140%' }}>
                  Repair location
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '14px', lineHeight: '140%' }}>
                {formatAddress(quoteDetails.delivery_address)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 4 }}></Box>

        <Box id={FormFieldIds.PAYMENT_METHOD_TYPE}>
          <PaymentMethods
            paymentMethodType={quoteDetails.payment_method_type}
            totalPrice={totalPrice}
            formError={formik.touched.paymentMethodType && formik.errors.paymentMethodType}
            refetch={refetch}
          />
        </Box>

        <Box sx={{ p: 8 }}></Box>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100vw',
          zIndex: '100',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          padding: 3,
          borderTop: '1px solid var(--Gray-100, #f2f2f3)',
          background: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <button className='btn-transparent' type='button' onClick={() => onBack()}>
            <CardMedia
              component='img'
              sx={{ width: 24, height: 'auto', marginLeft: -2 }}
              image={process.env.PUBLIC_URL + '/images/chevron-left.svg'}
            />
            Back to quote
          </button>
          <button className='btn-raised' type='button' onClick={() => handleContinueClick()}>
            Go to payment
          </button>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <PaymentCards />
        </Box>
      </Box>
    </form>
  )
}
