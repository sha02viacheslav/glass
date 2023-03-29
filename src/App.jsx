import { ThreeCircles } from 'react-loader-spinner'
import { usePromiseTracker } from 'react-promise-tracker'
import { Routes, Route } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PaymentAssist } from './components/PaymentAssist'
import { Contact } from './pages/Contact'
import { Customer } from './pages/Customer'
import { Home } from './pages/Home'
import { Paid } from './pages/Paid'
import { Pricing } from './pages/Pricing'
import { Quote } from './pages/Quote'
import { Services } from './pages/Services'
import './App.css'

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker()
  return (
    promiseInProgress && (
      <div
        style={{
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 2,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <ThreeCircles visible={true} color='#9557E8' height='100' width='100' />
        </div>
      </div>
    )
  )
}

function App() {
  return (
    <>
      <div className='main-content'>
        <div className='empty-test'>-</div>
        <LoadingIndicator />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/customer' element={<Customer />} />
          <Route path='/customer/:licenseNum' element={<Customer />} />
          <Route path='/payment/assist/:status' element={<PaymentAssist />} />
          <Route path='/payment/:status' element={<PaymentAssist />} />
          <Route path='/paid' element={<Paid />} />
          <Route path='/quote/:id' element={<Quote />} />
          <Route path='/quote/in/:id' element={<Quote />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
