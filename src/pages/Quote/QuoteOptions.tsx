import React, { useEffect } from 'react'
import { Box, CardMedia, Link, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { number, object } from 'yup'
import { DifferenceOEE_OEM } from '@glass/components/Help/DifferenceOEE_OEM'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PaymentCards } from '@glass/components/PaymentCards'
import { BookingTimes } from '@glass/components/quotePage/BookingTimes'
import { OptionalOrderLines } from '@glass/components/quotePage/OptionalOrderLines'
import { Packages } from '@glass/components/quotePage/Packages'
import { ReviewsDialog } from '@glass/components/ReviewsDialog'
import { BeforeAfterType, InquiryStep } from '@glass/enums'
import { Quote } from '@glass/models'
import { addOptionalProductService } from '@glass/services/apis/add-optional-product.service'
import { removeOptionalProductService } from '@glass/services/apis/remove-optional-product.service'
import { sendReserveBookingService } from '@glass/services/apis/send-reserve-booking.service'
import { updateQuotationPackageService } from '@glass/services/apis/update-quotation-package.service'
import { formatAddress } from '@glass/utils/format-address/format-address.util'
import { scrollToElementWithOffset, workingPlaceLabel } from '@glass/utils/index'
import { Testimonials } from '../Home/Testimonials'

export type QuoteOptionsForm = {
  quotationPackageId: number
  reserveBookingId: number
}

export enum FormFieldIds {
  QUOTATION_PACKAGE_ID = 'quotationPackageId',
  RESERVE_BOOKING_ID = 'reserveBookingId',
}

export type QuoteOptionsProps = {
  quoteDetails: Quote
  refetch: () => void
}

export const QuoteOptions: React.FC<QuoteOptionsProps> = ({ quoteDetails, refetch }) => {
  const { id: quoteId } = useParams()
  const navigate = useNavigate()

  const validationSchema = object({
    quotationPackageId: number().min(1, 'Please select the product').nullable(),
    reserveBookingId: number().min(1, 'Please select the date you would like to get repair done').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      quotationPackageId: 0,
      reserveBookingId: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
  })

  const backToEditQuote = (step: InquiryStep) => {
    const licenseReg = quoteDetails?.registration_number.replace(' ', '')
    navigate(`/customer/edit/${licenseReg}/${quoteId}/${step}`)
  }

  const handleCheckPackage = (packageId: number) => {
    if (!quoteId) return
    trackPromise(
      updateQuotationPackageService(quoteId, packageId).then((res) => {
        if (res.success) {
          formik.setFieldValue(FormFieldIds.QUOTATION_PACKAGE_ID, packageId)
          refetch()
        }
      }),
    )
  }

  const handleCheckOptionalOrderLine = (orderLineId: number, optionalLineId: number, checked: boolean) => {
    if (!quoteId) return
    if (checked) {
      trackPromise(
        addOptionalProductService(quoteId, optionalLineId).then((res) => {
          if (res.success) {
            refetch()
          }
        }),
      )
    } else {
      trackPromise(
        removeOptionalProductService(quoteId, orderLineId, optionalLineId).then((res) => {
          if (res.success) {
            refetch()
          }
        }),
      )
    }
  }

  const sendReserveBooking = (values: QuoteOptionsForm) => {
    if (!quoteId) return

    trackPromise(
      sendReserveBookingService(quoteId, values.reserveBookingId).then(() => {
        refetch()
      }),
    )
  }

  const handleContinueClick = () => {
    formik.setFieldTouched(FormFieldIds.QUOTATION_PACKAGE_ID, true, true)
    if (formik.errors.quotationPackageId) {
      scrollToElementWithOffset(FormFieldIds.QUOTATION_PACKAGE_ID, 100)
      return
    }
    formik.setFieldTouched(FormFieldIds.RESERVE_BOOKING_ID, true, true)
    if (formik.errors.reserveBookingId) {
      scrollToElementWithOffset(FormFieldIds.RESERVE_BOOKING_ID, 100)
      return
    }
    sendReserveBooking(formik.values)
  }

  useEffect(() => {
    if (quoteDetails) {
      const selectedPackage = Object.values(quoteDetails.quotation_packages).find(
        (item) => item.quotation_package_details[0]?.order_line_added,
      )
      formik.setFieldValue(FormFieldIds.QUOTATION_PACKAGE_ID, selectedPackage?.quotation_package_id || 0)
    }
  }, [quoteDetails])

  return (
    <form>
      <Box sx={{ paddingX: 4, marginBottom: 40 }}>
        <Box sx={{ padding: 3, marginBottom: 6, background: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CardMedia
                component='img'
                sx={{ width: 20, height: 20 }}
                image={process.env.PUBLIC_URL + '/images/account-blue.svg'}
              />
              <Typography sx={{ fontSize: '14px', lineHeight: '150%', whiteSpace: 'nowrap' }}>
                {quoteDetails.customer_f_name} {quoteDetails.customer_s_name}
              </Typography>
            </Box>

            <Box>
              <Box sx={{ width: '94px' }}>
                <Box sx={{ zoom: 0.3 }}>
                  <LicensePlate disabled={true} licenseNumber={quoteDetails.registration_number} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, marginTop: 4 }}>
                {!!quoteDetails.vehicle_logo_url && (
                  <CardMedia component='img' sx={{ width: 'auto', height: 20 }} image={quoteDetails.vehicle_logo_url} />
                )}
                <Typography
                  sx={{
                    color: 'var(--Gray-800, #14151F)',
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '150%',
                  }}
                >
                  {quoteDetails?.make} {quoteDetails?.model}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box id={FormFieldIds.QUOTATION_PACKAGE_ID}>
          <Packages
            packages={quoteDetails.quotation_packages || []}
            formError={formik.touched.quotationPackageId && formik.errors.quotationPackageId}
            onCheckPackage={handleCheckPackage}
          />
        </Box>

        <Box sx={{ p: 4 }}></Box>

        <OptionalOrderLines
          optionalOrderLines={quoteDetails.optional_order_lines || []}
          onCheckOptionalOrderLine={handleCheckOptionalOrderLine}
        />

        <DifferenceOEE_OEM />

        <Box sx={{ p: 2 }}></Box>

        <ReviewsDialog textColor='var(--Gray-800, #14151F)' />

        <Box sx={{ p: 4 }}></Box>

        <Box id={FormFieldIds.RESERVE_BOOKING_ID}>
          <BookingTimes
            reserveBookingId={formik.values.reserveBookingId}
            formError={formik.touched.reserveBookingId && formik.errors.reserveBookingId}
            onCheckReserveBooking={(value) => formik.setFieldValue(FormFieldIds.RESERVE_BOOKING_ID, value)}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/calendar.svg'}
            />
            {'Dates selected' || 'No date selected'}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/wrench.svg'}
            />
            {workingPlaceLabel(quoteDetails.working_place)}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, fontSize: '14px', lineHeight: '150%' }}>
            <CardMedia
              component='img'
              sx={{ width: 20, height: 20 }}
              image={process.env.PUBLIC_URL + '/images/map-marker-blue.svg'}
            />
            <Typography>
              {formatAddress(quoteDetails.delivery_address)}
              <Link sx={{ fontWeight: '700', marginLeft: 1 }} onClick={() => backToEditQuote(InquiryStep.STEP1)}>
                Edit Location
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 8 }}></Box>

        <OurMethod beforeAfterType={BeforeAfterType.ALL} showVideos={false} />

        <Box sx={{ p: 8 }}></Box>

        <Testimonials />
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
          padding: 'var(--16, 16px) var(--16, 16px) 40px var(--16, 16px)',
          borderTop: '1px solid var(--Gray-100, #f2f2f3)',
          background: '#fff',
        }}
      >
        <button className='btn-raised w-100' type='button' onClick={() => handleContinueClick()}>
          Proceed to checkout
        </button>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <PaymentCards />
        </Box>
      </Box>
    </form>
  )
}
