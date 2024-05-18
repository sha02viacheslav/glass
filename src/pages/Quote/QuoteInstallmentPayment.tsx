import React, { useEffect, useState } from 'react'
import { Box, CardMedia, List, ListItem, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EnumLoader } from 'src/core/enums/loader.enum'
import { object, string } from 'yup'
import { AddressInput } from '@glass/components/AddressInput'
import { PersonalInfoForm } from '@glass/components/PersonalInfoForm'
import { Address, MonthlyPayment, Quote, UpdateQuoteDto } from '@glass/models'
import { beginPaymentAssistService } from '@glass/services/apis/begin-payment-assist.service'
import { getPaymentAssistPlanService } from '@glass/services/apis/get-payment-assist-plan.service'
import { updateQuoteService } from '@glass/services/apis/update-quote.service'
import { scrollToElementWithOffset } from '@glass/utils/index'

export type QuoteInstallmentPaymentForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  invoiceAddress: string
}

export enum FormFieldIds {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PHONE = 'phone',
  INVOICE_ADDRESS = 'invoiceAddress',
}

export type QuoteInstallmentPaymentProps = {
  quoteDetails: Quote
  onBack: () => void
}

export const QuoteInstallmentPayment: React.FC<QuoteInstallmentPaymentProps> = ({ quoteDetails, onBack }) => {
  const { id: quoteId } = useParams()

  const validationSchema = object({
    firstName: string().required('Required').nullable(),
    lastName: string().required('Required').nullable(),
    email: string().email('Invalid email').required('Required').nullable(),
    phone: string().required('Required').nullable(),
    invoiceAddress: string().required('Required').nullable(),
  })

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      invoiceAddress: '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {},
  })

  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment | undefined>(undefined)
  const [billingAddress, setBillingAddress] = useState<Address | undefined>(undefined)

  const handleChangeBillingAddress = (address: Address | undefined) => {
    formik.setFieldValue(FormFieldIds.INVOICE_ADDRESS, address?.postcode)
    setBillingAddress(address)
  }

  const handleContinueClick = () => {
    formik.setFieldTouched(FormFieldIds.FIRST_NAME, true, true)
    formik.setFieldTouched(FormFieldIds.LAST_NAME, true, true)
    formik.setFieldTouched(FormFieldIds.EMAIL, true, true)
    formik.setFieldTouched(FormFieldIds.PHONE, true, true)
    formik.setFieldTouched(FormFieldIds.INVOICE_ADDRESS, true, true)
    if (formik.errors.firstName) {
      scrollToElementWithOffset(FormFieldIds.FIRST_NAME, 100)
      return
    } else if (formik.errors.lastName) {
      scrollToElementWithOffset(FormFieldIds.LAST_NAME, 100)
      return
    } else if (formik.errors.email) {
      scrollToElementWithOffset(FormFieldIds.EMAIL, 100)
      return
    } else if (formik.errors.phone) {
      scrollToElementWithOffset(FormFieldIds.PHONE, 100)
      return
    } else if (formik.errors.invoiceAddress) {
      scrollToElementWithOffset(FormFieldIds.INVOICE_ADDRESS, 100)
      return
    }
    updateQuote(formik.values)
  }

  const updateQuote = (values: QuoteInstallmentPaymentForm) => {
    if (quoteId) {
      const postData: UpdateQuoteDto = {
        fe_token: quoteId,

        // Personal Info
        customer_f_name: (values.firstName || '').trim(),
        customer_s_name: (values.lastName || '').trim(),
        customer_phone: (values.phone || '').trim(),
        customer_email: (values.email || '').trim(),

        // Address
        customer_address: {
          address_id: quoteDetails.delivery_address.address_id || 0,
          postcode: billingAddress?.postcode || '',
          latitude: billingAddress?.latitude || '',
          longitude: billingAddress?.longitude || '',
          line_1: billingAddress?.line_1 || '',
          line_2: billingAddress?.line_2 || '',
          line_3: billingAddress?.line_3 || '',
          line_4: billingAddress?.line_4 || '',
          locality: billingAddress?.locality || '',
          town_or_city: billingAddress?.town_or_city || '',
          county: billingAddress?.county || '',
          district: billingAddress?.district || '',
          country: billingAddress?.country || '',
        },
      }

      trackPromise(
        updateQuoteService(postData).then((res) => {
          if (res.success) {
            beginPaymentAssist()
          } else {
            toast(res.message)
          }
        }),
        EnumLoader.UPDATE_PERSONAL_INFO_ADDRESS,
      )
    }
  }

  const getPaymentAssistPlan = () => {
    if (quoteId && quoteDetails?.payment_method_type) {
      getPaymentAssistPlanService(quoteId, quoteDetails.payment_method_type).then((res) => {
        if (res.success) {
          setMonthlyPayments(res.data)
        }
      })
    }
  }

  const beginPaymentAssist = () => {
    if (quoteId && quoteDetails?.payment_method_type) {
      trackPromise(
        beginPaymentAssistService(quoteId, quoteDetails.payment_method_type).then((res) => {
          if (res.success) {
            window.open(res.data.url, '_blank', 'noreferrer')
          }
        }),
        EnumLoader.GENERATING_PLAN_URL,
      )
    }
  }

  useEffect(() => {
    if (!monthlyPayments) {
      getPaymentAssistPlan()
    }
  }, [monthlyPayments])

  useEffect(() => {
    if (quoteDetails) {
      formik.setFieldValue(FormFieldIds.FIRST_NAME, quoteDetails.customer_f_name)
      formik.setFieldValue(FormFieldIds.LAST_NAME, quoteDetails.customer_s_name)
      formik.setFieldValue(FormFieldIds.PHONE, quoteDetails.customer_phone)
      formik.setFieldValue(FormFieldIds.EMAIL, quoteDetails.customer_email)

      if (quoteDetails.delivery_address?.postcode) handleChangeBillingAddress(quoteDetails.delivery_address)
    }
  }, [quoteDetails])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <form>
      <Box sx={{ paddingX: 4, marginBottom: 40 }}>
        <Box
          sx={{
            paddingX: 3,
            py: 4,
            border: '1px solid var(--Yellow---Semantic-500, #FBBC05)',
            borderRadius: '4px',
            background: '#FFF9C6',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <CardMedia sx={{ width: 24, height: 24 }} image={process.env.PUBLIC_URL + '/images/alert-rhombus.svg'} />
            <Typography
              sx={{
                color: 'var(--WF-Base-800, #2D3648)',
                fontSize: 20,
                fontWeight: '700',
                lineHeight: '150%',
                letterSpacing: '-0.2px',
              }}
            >
              Read before continuing
            </Typography>
          </Box>

          <List
            sx={{
              listStyle: 'auto',
              pl: 6,
              color: 'var(--Gray-700, #474747)',
              lineHeight: '24px',
              letterSpacing: '-0.16px',
              mt: 2,
            }}
            component='ol'
          >
            <ListItem sx={{ paddingY: '2px' }}>Credit or “prepaid debit cards” aren&apos;t accepted.</ListItem>
            <ListItem sx={{ paddingY: '2px' }}>
              Name, address and all information must match with your debit card when paying upfront cost of £100. If
              not, payment will not go through
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6A6B71)',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '150%',
              letterSpacing: '0.84px',
            }}
          >
            Personal info
          </Typography>
          <Typography
            sx={{
              color: 'var(--WF-Base-700, #4A5468)',
              fontSize: 16,
              fontWeight: 400,
              lineHeight: '170%',
              mt: 4,
            }}
          >
            The details below must be the <strong>same</strong> as those registered with your debit card.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <PersonalInfoForm
              values={formik.values}
              touched={formik.touched}
              errors={formik.errors}
              setFieldValue={formik.setFieldValue}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography
            sx={{
              color: 'var(--Gray-600, #6A6B71)',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: '150%',
              letterSpacing: '0.84px',
            }}
          >
            ADDRESS WHERE YOUR DEBIT CARD IS REGISTERED
          </Typography>

          <Box id={FormFieldIds.INVOICE_ADDRESS} sx={{ mt: 6 }}>
            <AddressInput
              address={billingAddress}
              formError={formik.touched.invoiceAddress && formik.errors.invoiceAddress}
              onChange={handleChangeBillingAddress}
            />
          </Box>
        </Box>

        <Box sx={{ p: 4 }}></Box>

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
          gap: 3,
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
            Back
          </button>
          <button
            className='btn-raised'
            type='button'
            onClick={() => handleContinueClick()}
            disabled={!quoteDetails.payment_method_type}
          >
            Set up payment plan
            <CardMedia
              component='img'
              sx={{ width: 24, height: 'auto', marginRight: -2 }}
              image={process.env.PUBLIC_URL + '/images/open-in-new.svg'}
            />
          </button>
        </Box>

        <Typography sx={{ color: 'var(--Gray-600, #6A6B71)', lineHeight: '24px', letterSpacing: '-0.16px' }}>
          We use{' '}
          <CardMedia
            component='img'
            sx={{ width: 'auto', height: 16, display: 'inline' }}
            image={process.env.PUBLIC_URL + '/images/payment-assist.png'}
          />{' '}
          finance provider
        </Typography>
      </Box>
    </form>
  )
}
