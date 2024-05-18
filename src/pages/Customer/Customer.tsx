import './Customer.css'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Step,
  StepIcon,
  Stepper,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { trackPromise } from 'react-promise-tracker'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EnumLoader } from 'src/core/enums/loader.enum'
import { array, boolean, number, object, string } from 'yup'
import { AddPictures } from '@glass/components/AddPictures'
import { AddressInput } from '@glass/components/AddressInput/AddressInput'
import MobileService from '@glass/components/GoogleMap/MobileService'
import { Workshops } from '@glass/components/GoogleMap/Workshops'
import { HowToTakePic } from '@glass/components/Help/HowToTakePic'
import { LicensePlate } from '@glass/components/LicensePlate'
import { OurMethod } from '@glass/components/OurMethod'
import { PersonalInfoForm } from '@glass/components/PersonalInfoForm'
import { TimeSelection } from '@glass/components/quotePage/TimeSelection'
import { WindowSelector } from '@glass/components/WindowSelector'
import { INQUIRY_STEPS } from '@glass/constants'
import { BeforeAfterType, CarType, InquiryStep, OrderState, WorkingPlace } from '@glass/enums'
import { useRetrieveVehData } from '@glass/hooks/useRetrieveVehData'
import {
  Address,
  Attachment,
  BeforeAfter,
  Characteristic,
  Inquiry,
  InquiryFinalCheckDto,
  InquiryStep1Dto,
  InquiryStep2Dto,
  InquiryStep3Dto,
  InquiryStep4Dto,
  InquiryStep5Dto,
  Quote,
  RequestBooking,
  UpdateQuoteDto,
  Workshop,
} from '@glass/models'
import { beforeAfterService } from '@glass/services/apis/before-after.service'
import { getInquiryService } from '@glass/services/apis/get-inquiry.service'
import { getQuoteService } from '@glass/services/apis/get-quote.service'
import { getWorkshopService } from '@glass/services/apis/get-workshop.service'
import { submitInquiryService } from '@glass/services/apis/submit-inquiry.service'
import { updateInquiryFinalCheckService } from '@glass/services/apis/update-inquiry-final-check.service'
import { updateInquiryStep1Service } from '@glass/services/apis/update-inquiry-step1.service'
import { updateInquiryStep2Service } from '@glass/services/apis/update-inquiry-step2.service'
import { updateInquiryStep3Service } from '@glass/services/apis/update-inquiry-step3.service'
import { updateInquiryStep4Service } from '@glass/services/apis/update-inquiry-step4.service'
import { updateInquiryStep5Service } from '@glass/services/apis/update-inquiry-step5.service'
import { updateQuoteService } from '@glass/services/apis/update-quote.service'
import { scrollToElementWithOffset, workingPlaceLabel } from '@glass/utils/index'
import { EditQuoteHeader } from './EditQuoteHeader'
import { FinalCheck } from './FinalCheck'
import { QuoteActiveDialog } from './QuoteActiveDialog'
import { WorkshopCard } from './WorkshopCard'
import { LiveService } from '../Home/LiveService'

export type CustomerForm = {
  registrationNumber: string
  invoiceAddress: string
  workingPlace: WorkingPlace
  workshopId: boolean | number
  glassLocation: string[]
  characteristics: Characteristic[]
  comment: string
  attachments: Attachment[]
  firstName: string
  lastName: string
  email: string
  phone: string
  bookingEnabled: boolean
  requestBookings: RequestBooking[]
}

export enum FormFieldIds {
  REGISTRATION_NUMBER = 'registrationNumber',
  INVOICE_ADDRESS = 'invoiceAddress',
  WORKING_PLACE = 'workingPlace',
  WORKSHOP_ID = 'workshopId',
  GLASS_LOCATION = 'glassLocation',
  CHARACTERISTICS = 'characteristics',
  COMMENT = 'comment',
  ATTACHMENTS = 'attachments',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PHONE = 'phone',
  BOOKING_ENABLED = 'bookingEnabled',
  REQUEST_BOOKINGS = 'requestBookings',
}

export type CustomerProps = {
  editMode?: boolean
}

export const Customer: React.FC<CustomerProps> = ({ editMode = false }) => {
  const navigate = useNavigate()

  const { licenseNum, quoteId, step } = useParams()

  const steps = {
    [InquiryStep.STEP1]: { index: 1, title: 'Reg. number and Repair location' },
    [InquiryStep.STEP2]: { index: 2, title: 'Pick the broken glass' },
    [InquiryStep.STEP3]: { index: 3, title: 'Your comment and images' },
    [InquiryStep.STEP4]: { index: 4, title: 'Your personal info' },
    [InquiryStep.STEP5]: { index: 5, title: 'Repair date and time' },
    [InquiryStep.FINAL_CHECK]: { index: 6, title: 'Final check' },
  }

  const validationSchema = object({
    registrationNumber: string()
      .required('Invalid vehicle registration number. Please review and correct it.')
      .nullable(),
    invoiceAddress: string().required('Required').nullable(),
    workingPlace: string().required('Required').nullable(),
    glassLocation: array().of(string()).required().min(1, 'Select windows that need replacing'),
    firstName: string().required('Required').nullable(),
    lastName: string().required('Required').nullable(),
    email: string().email('Invalid email').required('Required').nullable(),
    phone: string().required('Required').nullable(),
    bookingEnabled: boolean(),
    requestBookings: array()
      .of(
        object({
          request_booking_id: number(),
          request_booking_date: string(),
          request_time_slot: string(),
        }),
      )
      .when('bookingEnabled', {
        is: true,
        then: (s) => s.required().min(1, 'Please pick the dates above'),
      }),
  })

  const formik = useFormik({
    initialValues: {
      registrationNumber: licenseNum || '',
      invoiceAddress: '',
      workingPlace: WorkingPlace.NONE,
      workshopId: false,
      glassLocation: [],
      characteristics: [],
      comment: '',
      attachments: [],
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bookingEnabled: false,
      requestBookings: [],
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      handleContinueClick()
    },
  })

  const [activeStep, setActiveStep] = React.useState<InquiryStep>(editMode ? (step as InquiryStep) : InquiryStep.STEP1)
  const [quoteDetails, setQuoteDetails] = useState<Quote | undefined>(undefined)
  const [licenseSearchVal, setLicense] = useState(licenseNum || '')
  const [inquiry, setInquiry] = useState<Inquiry | undefined>()
  const [billingAddress, setBillingAddress] = useState<Address | undefined>(undefined)
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfter[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [modalMap, setModalMap] = useState(false)
  const [selectedCarType, setSelectedCarType] = useState<CarType>(CarType.THREE_DOOR)
  const [showQuoteActivePopup, setShowQuoteActivePopup] = useState<boolean>(false)

  const selectedWorkshop = useMemo(() => {
    const workshopId = formik.values.workshopId
    return workshops?.find((item) => typeof workshopId === 'number' && item.id === workshopId)
  }, [workshops, formik.values.workshopId])

  const getInquiry = () => {
    const { registrationNumber } = formik.values
    return trackPromise(
      getInquiryService(registrationNumber).then((res) => {
        if (res.success) {
          setInquiry(res.data)
        } else {
          toast(res.message)
        }
      }),
    )
  }

  const getQuote = () => {
    if (quoteId) {
      trackPromise(
        getQuoteService(quoteId, false).then((res) => {
          if (res.success) {
            setQuoteDetails(res.data)
          }
        }),
      )
    }
  }

  const getWorkshop = () => {
    trackPromise(
      getWorkshopService().then((res) => {
        if (res.success) {
          setWorkshops(res.data)
        }
      }),
    )
  }

  useRetrieveVehData(quoteDetails?.DoorPlanLiteral || inquiry?.DoorPlanLiteral, (data: CarType) =>
    setSelectedCarType(data),
  )

  const handleContinueClick = () => {
    switch (activeStep) {
      case InquiryStep.STEP1: {
        formik.setFieldTouched(FormFieldIds.REGISTRATION_NUMBER, true, true)
        formik.setFieldTouched(FormFieldIds.INVOICE_ADDRESS, true, true)
        formik.setFieldTouched(FormFieldIds.WORKING_PLACE, true, true)
        if (formik.errors.registrationNumber) {
          scrollToElementWithOffset(FormFieldIds.REGISTRATION_NUMBER, 100)
          return
        } else if (formik.errors.invoiceAddress) {
          scrollToElementWithOffset(FormFieldIds.INVOICE_ADDRESS, 100)
          return
        } else if (formik.errors.workingPlace) {
          scrollToElementWithOffset(FormFieldIds.WORKING_PLACE, 100)
          return
        }
        if (editMode) {
          updateQuote(formik.values)
        } else if (inquiry?.order_state === OrderState.FINAL_CHECK) {
          updateInquiryFinalCheck(formik.values)
        } else {
          updateInquiryStep1(formik.values)
        }
        break
      }
      case InquiryStep.STEP2: {
        formik.setFieldTouched(FormFieldIds.GLASS_LOCATION, true, true)
        if (formik.errors.glassLocation) {
          scrollToElementWithOffset(FormFieldIds.GLASS_LOCATION, 100)
          return
        }
        if (editMode) {
          updateQuote(formik.values)
        } else if (inquiry?.order_state === OrderState.FINAL_CHECK) {
          updateInquiryFinalCheck(formik.values)
        } else {
          updateInquiryStep2(formik.values)
        }
        break
      }
      case InquiryStep.STEP3: {
        if (editMode) {
          updateQuote(formik.values)
        } else if (inquiry?.order_state === OrderState.FINAL_CHECK) {
          updateInquiryFinalCheck(formik.values)
        } else {
          updateInquiryStep3(formik.values)
        }
        break
      }
      case InquiryStep.STEP4: {
        formik.setFieldTouched(FormFieldIds.FIRST_NAME, true, true)
        formik.setFieldTouched(FormFieldIds.LAST_NAME, true, true)
        formik.setFieldTouched(FormFieldIds.EMAIL, true, true)
        formik.setFieldTouched(FormFieldIds.PHONE, true, true)
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
        }
        if (editMode) {
          updateQuote(formik.values)
        } else if (inquiry?.order_state === OrderState.FINAL_CHECK) {
          updateInquiryFinalCheck(formik.values)
        } else {
          updateInquiryStep4(formik.values)
        }
        break
      }
      case InquiryStep.STEP5: {
        formik.setFieldTouched(FormFieldIds.REQUEST_BOOKINGS, true, true)
        if (formik.errors.requestBookings) {
          scrollToElementWithOffset(FormFieldIds.REQUEST_BOOKINGS, 100)
          return
        }
        if (editMode) {
          updateQuote(formik.values)
        } else if (inquiry?.order_state === OrderState.FINAL_CHECK) {
          updateInquiryFinalCheck(formik.values)
        } else {
          updateInquiryStep5(formik.values)
        }
        break
      }
      case InquiryStep.FINAL_CHECK: {
        submitInquiry()
      }
    }
  }

  const afterUpdateInquiryStep = () => {
    getInquiry().then(() => {
      if (inquiry?.order_state === OrderState.FINAL_CHECK) {
        handleBackToSummaryClick()
      } else {
        goNext()
      }
    })
  }

  const goNext = () => {
    setActiveStep((prev) => INQUIRY_STEPS[INQUIRY_STEPS.findIndex((item) => item === prev) + 1])
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handlePreviousClick = () => {
    setActiveStep((prev) => INQUIRY_STEPS[INQUIRY_STEPS.findIndex((item) => item === prev) - 1])
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleBackToSummaryClick = () => {
    setActiveStep(InquiryStep.FINAL_CHECK)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const updateInquiryStep1 = (values: CustomerForm) => {
    if (!inquiry) return

    const postData: InquiryStep1Dto = {
      fe_token: inquiry.fe_token,
      customer_address: {
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
      working_place: values.workingPlace,
      workshop_id: formik.values.workshopId,
    }

    trackPromise(
      updateInquiryStep1Service(postData).then((res) => {
        if (res.success) {
          afterUpdateInquiryStep()
        } else {
          toast(res.message)
        }
      }),
      EnumLoader.SAVE_INQUIRY,
    )
  }

  const updateInquiryStep2 = (values: CustomerForm) => {
    if (!inquiry) return

    const postData: InquiryStep2Dto = {
      fe_token: inquiry.fe_token,
      glass_location: values.glassLocation,
      inquiry_characteristics: values.characteristics,
    }

    trackPromise(
      updateInquiryStep2Service(postData).then((res) => {
        if (res.success) {
          afterUpdateInquiryStep()
        } else {
          toast(res.message)
        }
      }),
      EnumLoader.SAVE_INQUIRY,
    )
  }

  const updateInquiryStep3 = (values: CustomerForm) => {
    if (!inquiry) return

    const removeAttachmentIds = inquiry.step_3.customer_attachments
      .filter(
        (attachment) => values.attachments.findIndex((item) => item.attachment_id === attachment.attachment_id) < 0,
      )
      .map((attachment) => attachment.attachment_id)

    const postData: InquiryStep3Dto = {
      fe_token: inquiry.fe_token,
      customer_comment: values.comment,
      customer_attachments: values.attachments.filter((item) => !item.attachment_id),
      remove_attachment_ids: removeAttachmentIds,
    }

    trackPromise(
      updateInquiryStep3Service(postData).then((res) => {
        if (res.success) {
          afterUpdateInquiryStep()
        } else {
          toast(res.message)
        }
      }),
      EnumLoader.SAVE_INQUIRY,
    )
  }

  const updateInquiryStep4 = (values: CustomerForm) => {
    if (!inquiry) return

    const postData: InquiryStep4Dto = {
      fe_token: inquiry.fe_token,
      customer_f_name: (values.firstName || '').trim(),
      customer_s_name: (values.lastName || '').trim(),
      customer_phone: (values.phone || '').trim(),
      customer_email: (values.email || '').trim(),
    }

    trackPromise(
      updateInquiryStep4Service(postData).then((res) => {
        if (res.success) {
          afterUpdateInquiryStep()
        } else {
          toast(res.message)
        }
      }),
    )
  }

  const updateInquiryStep5 = (values: CustomerForm) => {
    if (!inquiry) return

    const removeRequestBookingIds = inquiry.step_5.request_booking
      .filter(
        (booking) =>
          values.requestBookings.findIndex((item) => item.request_booking_id === booking.request_booking_id) < 0,
      )
      .map((booking) => booking.request_booking_id)

    const postData: InquiryStep5Dto = {
      fe_token: inquiry.fe_token,
      request_booking: values.requestBookings.filter((item) => !item.request_booking_id),
      remove_request_booking_ids: removeRequestBookingIds,
    }

    trackPromise(
      updateInquiryStep5Service(postData).then((res) => {
        if (res.success) {
          afterUpdateInquiryStep()
        } else {
          toast(res.message)
        }
      }),
      EnumLoader.SAVE_INQUIRY,
    )
  }

  const updateInquiryFinalCheck = (values: CustomerForm) => {
    if (!inquiry) return

    const removeAttachmentIds = inquiry.step_3.customer_attachments
      .filter(
        (attachment) => values.attachments.findIndex((item) => item.attachment_id === attachment.attachment_id) < 0,
      )
      .map((attachment) => attachment.attachment_id)

    const removeRequestBookingIds = inquiry.step_5.request_booking
      .filter(
        (booking) =>
          values.requestBookings.findIndex((item) => item.request_booking_id === booking.request_booking_id) < 0,
      )
      .map((booking) => booking.request_booking_id)

    const postData: InquiryFinalCheckDto = {
      fe_token: inquiry.fe_token,
      // Step 1
      customer_address: {
        address_id: inquiry.step_1.delivery_address.address_id || 0,
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
      working_place: values.workingPlace,
      workshop_id: formik.values.workshopId,
      // Step 2
      glass_location: values.glassLocation,
      inquiry_characteristics: values.characteristics,
      // Step 3
      customer_comment: values.comment,
      customer_attachments: values.attachments.filter((item) => !item.attachment_id),
      remove_attachment_ids: removeAttachmentIds,
      // Step 4
      customer_f_name: (values.firstName || '').trim(),
      customer_s_name: (values.lastName || '').trim(),
      customer_phone: (values.phone || '').trim(),
      customer_email: (values.email || '').trim(),
      // Step 5
      request_booking: values.requestBookings.filter((item) => !item.request_booking_id),
      remove_request_booking_ids: removeRequestBookingIds,
    }

    trackPromise(
      updateInquiryFinalCheckService(postData).then((res) => {
        if (res.success) {
          afterUpdateInquiryStep()
        } else {
          toast(res.message)
        }
      }),
      EnumLoader.SAVE_INQUIRY,
    )
  }

  const submitInquiry = () => {
    if (inquiry?.fe_token) {
      trackPromise(
        submitInquiryService(inquiry.fe_token).then((res) => {
          if (res.success) {
            navigate('/quote/' + inquiry.fe_token)
          } else {
            toast(res.message)
          }
        }),
        EnumLoader.SAVE_INQUIRY,
      )
    }
  }

  const updateQuote = (values: CustomerForm) => {
    if (editMode && quoteDetails && quoteId) {
      const removeAttachmentIds = quoteDetails.customer_attachments
        .filter(
          (attachment) => values.attachments.findIndex((item) => item.attachment_id === attachment.attachment_id) < 0,
        )
        .map((attachment) => attachment.attachment_id)

      const removeRequestBookingIds = quoteDetails.request_booking
        .filter(
          (booking) =>
            values.requestBookings.findIndex((item) => item.request_booking_id === booking.request_booking_id) < 0,
        )
        .map((booking) => booking.request_booking_id)

      const postData: UpdateQuoteDto = {
        fe_token: quoteId,
        // Step 1
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
        working_place: values.workingPlace,
        workshop_id: formik.values.workshopId,
        // Step 2
        glass_location: values.glassLocation,
        inquiry_characteristics: values.characteristics,
        // Step 3
        customer_comment: values.comment,
        customer_attachments: values.attachments.filter((item) => !item.attachment_id),
        remove_attachment_ids: removeAttachmentIds,
        // Step 4
        customer_f_name: (values.firstName || '').trim(),
        customer_s_name: (values.lastName || '').trim(),
        customer_phone: (values.phone || '').trim(),
        customer_email: (values.email || '').trim(),
        // Step 5
        request_booking: values.requestBookings.filter((item) => !item.request_booking_id),
        remove_request_booking_ids: removeRequestBookingIds,
      }

      trackPromise(
        updateQuoteService(postData).then((res) => {
          if (res.success) {
            navigate(`/quote/${quoteId}`)
          } else {
            toast(res.message)
          }
        }),
        EnumLoader.SAVE_QUOTE,
      )
    }
  }

  const handleChangeBillingAddress = (address: Address | undefined) => {
    formik.setFieldValue(FormFieldIds.INVOICE_ADDRESS, address?.postcode)
    setBillingAddress(address)
  }

  const handleChangeTimeSlot = (requestBookings: RequestBooking[]) => {
    formik.setFieldValue(FormFieldIds.REQUEST_BOOKINGS, requestBookings)
  }

  const getBeforeAfterImages = () => {
    if (formik.values?.registrationNumber && formik.values?.glassLocation?.length) {
      beforeAfterService(
        BeforeAfterType.NEW_INQUIRY,
        formik.values.registrationNumber,
        formik.values?.glassLocation,
      ).then((res) => {
        if (res.success) {
          setBeforeAfterItems(res.data)
        }
      })
    }
  }

  useEffect(() => {
    if (!beforeAfterItems?.length) {
      getBeforeAfterImages()
    }
  }, [beforeAfterItems])

  useEffect(() => {
    if (!workshops.length) {
      getWorkshop()
    }
  }, [workshops])

  useEffect(() => {
    if (inquiry) {
      switch (inquiry.order_state) {
        case OrderState.NEW:
        case OrderState.OPEN:
        case OrderState.PAYMENT_IN_1H:
        case OrderState.PAYMENT_IN_1H_EXPIRED:
        case OrderState.CONFIRM:
        case OrderState.WON:
        case OrderState.LOST:
          setShowQuoteActivePopup(true)
          return
      }

      // Step 1
      formik.setFieldValue(FormFieldIds.REGISTRATION_NUMBER, licenseSearchVal)
      setActiveStep(inquiry.order_state as unknown as InquiryStep)
      if (inquiry.step_1.delivery_address?.postcode) handleChangeBillingAddress(inquiry.step_1.delivery_address)
      formik.setFieldValue(FormFieldIds.WORKING_PLACE, inquiry.step_1.working_place)
      formik.setFieldValue(FormFieldIds.WORKSHOP_ID, inquiry.step_1.workshop_id)

      // Step 2
      const selectedWindows = inquiry.step_2.glass_location || []
      if (selectedWindows.length > 0) {
        formik.setFieldValue(FormFieldIds.GLASS_LOCATION, selectedWindows)
      }
      // Step 3
      formik.setFieldValue(FormFieldIds.COMMENT, inquiry.step_3.customer_comment)
      formik.setFieldValue(FormFieldIds.ATTACHMENTS, inquiry.step_3.customer_attachments)

      // Step 4
      formik.setFieldValue(FormFieldIds.FIRST_NAME, inquiry.step_4.customer_f_name)
      formik.setFieldValue(FormFieldIds.LAST_NAME, inquiry.step_4.customer_s_name)
      formik.setFieldValue(FormFieldIds.PHONE, inquiry.step_4.customer_phone)
      formik.setFieldValue(FormFieldIds.EMAIL, inquiry.step_4.customer_email)

      // Step 5
      formik.setFieldValue(FormFieldIds.BOOKING_ENABLED, !!inquiry.step_5.request_booking.length)
      formik.setFieldValue(FormFieldIds.REQUEST_BOOKINGS, inquiry.step_5.request_booking)
    } else {
      formik.setFieldValue(FormFieldIds.REGISTRATION_NUMBER, '')
    }
  }, [inquiry])

  useEffect(() => {
    if (!quoteDetails && editMode && quoteId) {
      getQuote()
    }

    if (quoteDetails) {
      // Step 1
      formik.setFieldValue(FormFieldIds.REGISTRATION_NUMBER, licenseSearchVal)
      handleChangeBillingAddress(quoteDetails.delivery_address)
      formik.setFieldValue(FormFieldIds.WORKING_PLACE, quoteDetails.working_place)
      formik.setFieldValue(FormFieldIds.WORKSHOP_ID, quoteDetails.workshop.id)

      // Step 2
      const selectedWindows = quoteDetails.glass_location || []
      if (selectedWindows.length > 0) {
        formik.setFieldValue(FormFieldIds.GLASS_LOCATION, selectedWindows)
      }
      // Step 3
      formik.setFieldValue(FormFieldIds.COMMENT, quoteDetails.customer_comment)
      formik.setFieldValue(FormFieldIds.ATTACHMENTS, quoteDetails.customer_attachments)

      // Step 4
      formik.setFieldValue(FormFieldIds.FIRST_NAME, quoteDetails.customer_f_name)
      formik.setFieldValue(FormFieldIds.LAST_NAME, quoteDetails.customer_s_name)
      formik.setFieldValue(FormFieldIds.PHONE, quoteDetails.customer_phone)
      formik.setFieldValue(FormFieldIds.EMAIL, quoteDetails.customer_email)

      // Step 5
      formik.setFieldValue(FormFieldIds.BOOKING_ENABLED, !!quoteDetails.request_booking.length)
      formik.setFieldValue(FormFieldIds.REQUEST_BOOKINGS, quoteDetails.request_booking)
    }
  }, [quoteDetails])

  return (
    <>
      {editMode && !!quoteId && <EditQuoteHeader quoteId={quoteId} title={steps[activeStep].title} />}

      <div className='customer-page'>
        <form onSubmit={formik.handleSubmit}>
          {!editMode && activeStep !== InquiryStep.FINAL_CHECK && (
            <div className='step-wrapper'>
              <div className='title'>
                <span className='gray'>Step {steps[activeStep].index}</span> - {steps[activeStep].title}
              </div>
              <Stepper activeStep={steps[activeStep].index} sx={{ margin: '0 -4px' }}>
                {Object.keys(steps)
                  .slice(0, 5)
                  .map((step) => {
                    const stepProps: { completed?: boolean } = {}

                    return (
                      <Step key={step} {...stepProps} sx={{ paddingLeft: '4px', paddingRight: '4px' }}>
                        <StepIcon
                          icon={steps[step as InquiryStep].index}
                          active={step === activeStep}
                          completed={step < activeStep}
                        ></StepIcon>
                      </Step>
                    )
                  })}
              </Stepper>
            </div>
          )}

          <Box
            className='tab-content'
            sx={{ height: activeStep === InquiryStep.STEP1 ? 'auto' : '0px', overflow: 'hidden' }}
          >
            <div className='padding-48'></div>
            <section>
              <div className='title'>CAR REGISTRATION NUMBER</div>
              <div className='description'>Enter your car&apos;s registration and hit the search.</div>
              <div
                id={FormFieldIds.REGISTRATION_NUMBER}
                className={
                  'reg-card' + (formik.touched.registrationNumber && formik.errors.registrationNumber ? ' invalid' : '')
                }
              >
                <LicensePlate
                  disabled={editMode}
                  placeholderVal='Enter reg'
                  licenseNumber={licenseSearchVal}
                  showSearch={true}
                  showModel={true}
                  handleVehInputChange={(val) => {
                    setLicense(val)
                  }}
                  handleVehicleDataChange={(data) => setInquiry(data)}
                />
              </div>
              <small className='form-error'>
                {formik.touched.registrationNumber && formik.errors.registrationNumber}
              </small>
            </section>

            <div className='padding-48'></div>

            <section>
              <div className='title'>YOUR LOCATION</div>
              <div className='description'>
                We need your location to suggest closest workshop or see if we can do mobile service.
              </div>
              <div id={FormFieldIds.INVOICE_ADDRESS} className='form-group mb-4'>
                <AddressInput
                  address={billingAddress}
                  formError={formik.touched.invoiceAddress && formik.errors.invoiceAddress}
                  onChange={handleChangeBillingAddress}
                  disabled={editMode}
                />
              </div>
            </section>

            <div className='padding-48'></div>

            <section className={!!formik.errors.invoiceAddress ? 'disabled' : ''}>
              <div className='title'>REPAIR LOCATION</div>
              <div className='description'>Where would you like to get repair done?</div>
              <FormControl
                id={FormFieldIds.WORKING_PLACE}
                disabled={!!formik.errors.invoiceAddress}
                error={formik.touched.workingPlace && !!formik.errors.workingPlace}
              >
                <RadioGroup
                  row
                  value={formik.values.workingPlace}
                  onChange={(_, value) => formik.setFieldValue(FormFieldIds.WORKING_PLACE, value as WorkingPlace)}
                >
                  <FormControlLabel
                    value={WorkingPlace.WORKSHOP}
                    control={<Radio />}
                    label={workingPlaceLabel(WorkingPlace.WORKSHOP)}
                  />
                  <FormControlLabel
                    value={WorkingPlace.MOBILE}
                    control={<Radio />}
                    label={workingPlaceLabel(WorkingPlace.MOBILE)}
                  />
                </RadioGroup>
              </FormControl>
              <small className='form-error'>
                {!formik.errors.invoiceAddress && formik.touched.workingPlace && formik.errors.workingPlace}
              </small>

              {formik.values.workingPlace === WorkingPlace.WORKSHOP && (
                <Box sx={{ marginTop: '24px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <Typography sx={{ lineHeight: '140%' }}>Choose a repair workshop from the list below. </Typography>
                    <button className='btn-stroked' onClick={() => setModalMap(true)}>
                      <img src={process.env.PUBLIC_URL + '/images/map.svg'} />
                      Map view
                    </button>
                  </Box>

                  <Box sx={{ borderTop: '1px solid var(--Gray-100, #f2f2f3)', paddingTop: '16px', marginTop: '8px' }}>
                    {workshops.map((workshop, index) => (
                      <WorkshopCard
                        key={index}
                        workshop={workshop}
                        selected={
                          typeof formik.values.workshopId === 'number' && formik.values.workshopId === workshop.id
                        }
                        onSelect={() => formik.setFieldValue(FormFieldIds.WORKSHOP_ID, workshop.id)}
                      ></WorkshopCard>
                    ))}
                  </Box>
                </Box>
              )}

              {formik.values.workingPlace === WorkingPlace.MOBILE && (
                <Box sx={{ marginTop: '24px' }}>
                  {!!workshops.length && <MobileService workshops={workshops} />}
                  <LiveService image='live-service-bg1.png' />
                </Box>
              )}
            </section>
            <div className='padding-64'></div>
          </Box>

          <Box
            className='tab-content'
            sx={{ height: activeStep === InquiryStep.STEP2 ? 'auto' : '0px', overflow: 'hidden' }}
          >
            <div className='padding-48'></div>
            <section>
              <div id={FormFieldIds.GLASS_LOCATION}>
                <WindowSelector
                  carType={selectedCarType}
                  registrationNumber={formik.values.registrationNumber}
                  selectedGlasses={formik.values.glassLocation}
                  setCarType={setSelectedCarType}
                  onSelectBrokenGlasses={(value) => formik.setFieldValue(FormFieldIds.GLASS_LOCATION, value)}
                  onChangeCharacteristics={(values) => formik.setFieldValue(FormFieldIds.CHARACTERISTICS, values)}
                />

                <div className='no-glass'>
                  {formik.values.glassLocation.length ? formik.values.glassLocation.length : 'No'} glass selected
                </div>
              </div>
            </section>
            <div className='padding-64'></div>
          </Box>

          <Box
            className='tab-content'
            sx={{ height: activeStep === InquiryStep.STEP3 ? 'auto' : '0px', overflow: 'hidden' }}
          >
            <div className='padding-48'></div>
            <section>
              <Box
                sx={{
                  paddingX: 4,
                  paddingY: 3,
                  borderRadius: '2px',
                  border: '1px solid var(--Dark-Blue---Accent-500, #4522C2)',
                  background: 'var(--Dark-Blue---Accent-00, #ECE8FE)',
                }}
              >
                <Typography
                  sx={{
                    color: 'var(--Dark-Blue---Accent-800, #090221)',
                    fontWeight: '700',
                    lineHeight: '150%',
                    letterSpacing: '0.8px',
                  }}
                >
                  IMPORTANT
                </Typography>
                <Typography
                  sx={{
                    color: 'var(--Light-Blue---Primary-700, #081F44)',
                    lineHeight: '170%',
                    marginTop: 1,
                  }}
                >
                  Adding images is optional, but it helps to reduce possible mistakes. You can upload pictures later as
                  well.
                </Typography>
              </Box>
              <Box sx={{ marginTop: 6 }}>
                <AddPictures
                  attachments={formik.values.attachments}
                  onChangeAttachments={(value) => formik.setFieldValue(FormFieldIds.ATTACHMENTS, value)}
                />

                <HowToTakePic />

                <Typography sx={{ lineHeight: '150%', marginTop: 6, marginBottom: 2 }}>Additional comments</Typography>
                <FormControl fullWidth>
                  <OutlinedInput
                    value={formik.values.comment}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder='Any info you think that can help...'
                    sx={{ fontSize: 14, paddingY: 0 }}
                    onChange={(e) => formik.setFieldValue(FormFieldIds.COMMENT, e.target.value)}
                    error={formik.touched.comment && !!formik.errors.comment}
                  />
                </FormControl>
              </Box>
            </section>
            <div className='padding-64'></div>
          </Box>

          <Box
            className='tab-content'
            sx={{ height: activeStep === InquiryStep.STEP4 ? 'auto' : '0px', overflow: 'hidden' }}
          >
            <div className='padding-48'></div>
            <section>
              <PersonalInfoForm
                values={formik.values}
                touched={formik.touched}
                errors={formik.errors}
                setFieldValue={formik.setFieldValue}
              />
            </section>
            <div className='padding-64'></div>
          </Box>

          <Box
            className='tab-content'
            sx={{ height: activeStep === InquiryStep.STEP5 ? 'auto' : '0px', overflow: 'hidden' }}
          >
            <div className='padding-32'></div>
            <section>
              <TimeSelection
                bookingEnabled={formik.values.bookingEnabled}
                requestBookings={formik.values.requestBookings}
                onChangeBookingEnabled={(value) => formik.setFieldValue(FormFieldIds.BOOKING_ENABLED, value)}
                onChangeTimeSlot={(value) => handleChangeTimeSlot(value)}
                formError={formik.touched.requestBookings && formik.errors.requestBookings}
              />
            </section>
            <div className='padding-64'></div>
          </Box>

          <Box
            className='tab-content'
            sx={{ height: activeStep === InquiryStep.FINAL_CHECK ? 'auto' : '0px', overflow: 'hidden' }}
          >
            <div className='padding-32'></div>
            <section>
              {!!inquiry && (
                <FinalCheck
                  selectedCarType={selectedCarType}
                  inquiry={inquiry}
                  onEdit={(value) => setActiveStep(value)}
                ></FinalCheck>
              )}
            </section>
            <div className='padding-64'></div>
          </Box>

          <div className='padding-64'></div>

          <Box
            sx={{
              position: 'fixed',
              bottom: '0',
              left: '0',
              width: '100vw',
              zIndex: '100',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: 'var(--16, 16px) var(--16, 16px) 40px var(--16, 16px)',
              borderTop: '1px solid var(--Gray-100, #f2f2f3)',
              background: '#fff',
            }}
          >
            {/* Update quote details */}
            {editMode && !!quoteDetails && (
              <>
                <button className='btn-raised w-100' type='button' onClick={handleContinueClick}>
                  Save changes
                </button>
              </>
            )}

            {/* Update final check */}
            {inquiry?.order_state === OrderState.FINAL_CHECK && activeStep !== InquiryStep.FINAL_CHECK && (
              <>
                <button className='btn-transparent' type='button' onClick={handleBackToSummaryClick}>
                  Back to Summary
                </button>
                <button className='btn-raised' type='button' onClick={handleContinueClick}>
                  Save changes
                </button>
              </>
            )}

            {/* Final check */}
            {activeStep === InquiryStep.FINAL_CHECK && (
              <>
                <button className='btn-raised w-100' type='button' onClick={handleContinueClick}>
                  Submit
                </button>
              </>
            )}

            {/* Inquiry is in progress */}
            {!editMode && inquiry?.order_state !== OrderState.FINAL_CHECK && (
              <>
                <div>
                  {activeStep === InquiryStep.STEP1 && formik.values.workingPlace === WorkingPlace.WORKSHOP && (
                    <>
                      <Typography
                        sx={{
                          color: 'var(--Gray-600, #6A6B71)',
                          fontSize: '14px',
                          fontWeight: '300',
                          lineHeight: '24px',
                          letterSpacing: '-0.14px',
                        }}
                      >
                        Workshop picked
                      </Typography>
                      <Typography
                        sx={{
                          color: 'var(--Gray-800, #14151F)',
                          fontSize: '16px',
                          fontWeight: '400',
                          lineHeight: '24px',
                          letterSpacing: '-0.16px',
                        }}
                      >
                        {!!selectedWorkshop ? selectedWorkshop.name : 'You did not pick'}
                      </Typography>
                    </>
                  )}
                  {activeStep !== InquiryStep.STEP1 && (
                    <button className='btn-transparent' type='button' onClick={handlePreviousClick}>
                      <img src={process.env.PUBLIC_URL + '/images/chevron-left.svg'} />
                      Previous
                    </button>
                  )}
                </div>
                <button className='btn-raised' type='button' onClick={handleContinueClick}>
                  {activeStep === InquiryStep.STEP5 ? 'Final check' : 'Continue'}
                </button>
              </>
            )}
          </Box>
        </form>

        {!!beforeAfterItems?.length && (
          <OurMethod beforeAfterImages={beforeAfterItems} showTitle={false} showVideos={false} />
        )}
        {modalMap && workshops.length && <Workshops onDismiss={() => setModalMap(false)} workshops={workshops} />}
      </div>

      {showQuoteActivePopup && !!inquiry && (
        <QuoteActiveDialog
          customerFirstName={inquiry.step_4.customer_f_name}
          onConfirm={() => navigate(`/quote/${inquiry.fe_token}`)}
        />
      )}
    </>
  )
}
