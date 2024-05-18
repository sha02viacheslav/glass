import './App.css'
import React, { useEffect, useState } from 'react'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/system'
import { usePromiseTracker } from 'react-promise-tracker'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Footer } from '@glass/components/Footer'
import { Header } from '@glass/components/Header'
import { Loader } from '@glass/components/Loader'
import { PaymentAssist } from '@glass/components/PaymentAssist'
import { QuickContact } from '@glass/components/QuickContact'
import { AboutUs } from '@glass/pages/AboutUs'
import { Contact } from '@glass/pages/Contact'
import { Customer } from '@glass/pages/Customer'
import { Home } from '@glass/pages/Home'
import { Paid } from '@glass/pages/Paid'
import { QuotePage } from '@glass/pages/Quote'
import { Services } from '@glass/pages/Services'
import { setRequestedURL } from '@glass/utils/session/session.util'
import 'react-toastify/dist/ReactToastify.css'
import { EnumLoader } from './core/enums/loader.enum'
import { Comparison } from './pages/Comparison'
import { InquiryIntro } from './pages/InquiryIntro'
import { Installments } from './pages/Installments'
import { PaRedirection } from './pages/PaRedirection/PaRedirection'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { Process } from './pages/Process'
import { QuoteDetails } from './pages/QuoteDetails'
import { ServiceDetail } from './pages/ServiceDetail'
import TermsConditions from './pages/TermsConditions'

export const LoadingIndicator: React.FC = () => {
  const { promiseInProgress: SAVE_INQUIRY } = usePromiseTracker({ area: EnumLoader.SAVE_INQUIRY })
  const { promiseInProgress: SAVE_QUOTE } = usePromiseTracker({ area: EnumLoader.SAVE_QUOTE })
  const { promiseInProgress: CANCEL_BOOKING } = usePromiseTracker({ area: EnumLoader.CANCEL_BOOKING })
  const { promiseInProgress: UPDATE_PERSONAL_INFO_ADDRESS } = usePromiseTracker({
    area: EnumLoader.UPDATE_PERSONAL_INFO_ADDRESS,
  })
  const { promiseInProgress: GENERATING_PLAN_URL } = usePromiseTracker({ area: EnumLoader.GENERATING_PLAN_URL })
  const { promiseInProgress: RESET_QUOTE } = usePromiseTracker({ area: EnumLoader.RESET_QUOTE })
  const { promiseInProgress: PAYMENT_METHOD } = usePromiseTracker({ area: EnumLoader.PAYMENT_METHOD })
  const { promiseInProgress: LOAD_QUOTE } = usePromiseTracker({ area: EnumLoader.LOAD_QUOTE })
  const { promiseInProgress } = usePromiseTracker()
  let title = undefined
  if (SAVE_INQUIRY) {
    title = 'Sending inquiry...'
  } else if (SAVE_QUOTE) {
    title = 'Saving quote...'
  } else if (CANCEL_BOOKING) {
    title = 'Cancelling booking...'
  } else if (UPDATE_PERSONAL_INFO_ADDRESS) {
    title = 'Updating personal info and address...'
  } else if (GENERATING_PLAN_URL) {
    title = 'Generating payment plan URL...'
  } else if (RESET_QUOTE) {
    title = 'Resetting quotation...'
  } else if (PAYMENT_METHOD) {
    title = 'Updating payment method...'
  } else if (LOAD_QUOTE) {
    title = 'Loading quotation...'
  }
  return (
    <Loader
      loading={
        promiseInProgress ||
        SAVE_INQUIRY ||
        SAVE_QUOTE ||
        CANCEL_BOOKING ||
        UPDATE_PERSONAL_INFO_ADDRESS ||
        GENERATING_PLAN_URL ||
        RESET_QUOTE ||
        PAYMENT_METHOD ||
        LOAD_QUOTE
      }
      title={title}
    />
  )
}

const theme = createTheme({
  spacing: 4,
  typography: {
    fontFamily: [
      'Nunito Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'var(--Gray-800, #14151F)',
        },
        h3: {
          fontWeight: '700',
        },
        h4: {
          fontWeight: '700',
        },
        h5: {
          fontWeight: '700',
        },
        h6: {
          fontWeight: '700',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'var(--Light-Blue---Primary-500, #225fc2)',
          '&:hover': {
            color: 'var(--Light-Blue---Primary-500, #225fc2)',
          },
          textDecoration: 'none',
          cursor: 'pointer',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'var(--Light-Blue---Primary-400)',
          '&.Mui-checked': {
            color: 'var(--Light-Blue---Primary-400)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          display: 'list-item',
          paddingLeft: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '.MuiOutlinedInput-input': {
            paddingBlock: '12px 12px',
            width: '100%',
            lineHeight: '24px',
            boxSizing: 'border-box',
            height: 'unset',
          },
        },
      },
    },
  },
})

export const App: React.FC = () => {
  const location = useLocation()
  const [showHeader, setShowHeader] = useState<boolean>(true)
  const [showMenu, setShowMenu] = useState<boolean>(true)
  const [showQuickContact, setShowQuickContact] = useState<boolean>(true)
  const [showFooter, setShowFooter] = useState<boolean>(true)

  useEffect(() => {
    setShowHeader(
      !location.pathname.startsWith('/customer/edit') &&
        !location.pathname.startsWith('/quote') &&
        !location.pathname.startsWith('/quote-details'),
    )
    setShowMenu(
      !location.pathname.startsWith('/quote') &&
        !location.pathname.startsWith('/inquiry-intro') &&
        !location.pathname.startsWith('/customer'),
    )
    setShowQuickContact(
      !location.pathname.startsWith('/quote') &&
        !location.pathname.startsWith('/service-detail') &&
        !location.pathname.startsWith('/customer'),
    )
    setShowFooter(
      !location.pathname.startsWith('/quote') &&
        !location.pathname.startsWith('/customer') &&
        !location.pathname.startsWith('/service-detail'),
    )

    if (location.pathname === '/' && location.search) {
      setRequestedURL(window.location.href)
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  return (
    <>
      <div className='main-content'>
        <ThemeProvider theme={theme}>
          <LoadingIndicator />
          {showHeader && <Header showMenu={showMenu} />}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/services' element={<Services />} />
            <Route path='/service-detail/:serviceKey' element={<ServiceDetail />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/terms-conditions' element={<TermsConditions />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/installments' element={<Installments />} />
            <Route path='/comparison' element={<Comparison />} />
            <Route path='/process' element={<Process />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/inquiry-intro' element={<InquiryIntro />} />
            <Route path='/inquiry-intro/:licenseNum' element={<InquiryIntro />} />
            <Route path='/customer' element={<Customer />} />
            <Route path='/customer/:licenseNum' element={<Customer />} />
            <Route path='/customer/edit/:licenseNum/:quoteId/:step' element={<Customer editMode={true} />} />
            <Route path='/payment/assist/:status' element={<PaymentAssist />} />
            <Route path='/payment/:status' element={<PaymentAssist />} />
            <Route path='/paid' element={<Paid />} />
            <Route path='/quote/:id' element={<QuotePage />} />
            <Route path='/quote/in/:id' element={<QuotePage />} />
            <Route path='/quote/be/:id' element={<QuotePage quoteCount={false} />} />
            <Route path='/quote-details/:quoteId' element={<QuoteDetails />} />
            <Route path='/payment/assist/success/:id' element={<PaRedirection />} />
            <Route path='/payment/assist/failed/:id' element={<PaRedirection />} />
          </Routes>
          {showQuickContact && <QuickContact showReg={showMenu} />}
          {showFooter && <Footer />}
          <ToastContainer position='bottom-right' theme='dark' hideProgressBar={true} />
        </ThemeProvider>
      </div>
    </>
  )
}

export default App
