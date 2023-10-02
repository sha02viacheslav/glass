import './App.css'
import React, { useEffect, useState } from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Footer } from '@glass/components/Footer'
import { Header } from '@glass/components/Header'
import { Loader } from '@glass/components/Loader'
import { PaymentAssist } from '@glass/components/PaymentAssist'
import { Contact } from '@glass/pages/Contact'
import { Customer } from '@glass/pages/Customer'
import { Home } from '@glass/pages/Home'
import { Paid } from '@glass/pages/Paid'
import { Pricing } from '@glass/pages/Pricing'
import { QuotePage } from '@glass/pages/Quote'
import { Services } from '@glass/pages/Services'
import { setRequestedURL } from '@glass/utils/session/session.util'

export const LoadingIndicator: React.FC = () => {
  const { promiseInProgress } = usePromiseTracker()
  return <Loader loading={promiseInProgress} />
}

export const App: React.FC = () => {
  const location = useLocation()
  const [showMenu, setShowMenu] = useState<boolean>(true)

  useEffect(() => {
    setShowMenu(!location.pathname.startsWith('/quote') && !location.pathname.startsWith('/customer'))

    if (location.pathname === '/' && location.search) {
      setRequestedURL(window.location.href)
    }
  }, [location])

  return (
    <>
      <div className='main-content'>
        <div className='empty-test'>-</div>
        <LoadingIndicator />
        <Header showMenu={showMenu} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/customer' element={<Customer />} />
          <Route path='/customer/:licenseNum' element={<Customer />} />
          <Route path='/customer/edit/:licenseNum/:quoteId' element={<Customer editMode={true} />} />
          <Route path='/payment/assist/:status' element={<PaymentAssist />} />
          <Route path='/payment/:status' element={<PaymentAssist />} />
          <Route path='/paid' element={<Paid />} />
          <Route path='/quote/:id' element={<QuotePage />} />
          <Route path='/quote/in/:id' element={<QuotePage />} />
          <Route path='/quote/be/:id' element={<QuotePage quoteCount={false} />} />
        </Routes>
        {showMenu && <Footer />}
      </div>
    </>
  )
}

export default App
