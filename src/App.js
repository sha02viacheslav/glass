import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom'
// import useScript from "./customHooks/useScript";

import Home from './pages/Home'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import Customer from './pages/Customer'
import Payment from './pages/Payment';
import Paid from './pages/Paid';
import Quote from './pages/Quote';

import { usePromiseTracker } from "react-promise-tracker";
import { ThreeCircles } from 'react-loader-spinner';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
    return (
    promiseInProgress && 
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.2)",
        zIndex: 2,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >

        <ThreeCircles visible={true} color="#9557E8" height="100" width="100" />
      </div>
    </div>
  );
}
function App() {
  // useScript("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js");
  // useScript("js/bootstrap.min.js");
  // useScript("js/popper.min.js");
  return (
    <>
      <div className='main-content'>
      <LoadingIndicator/>
        <Header />
        <Routes>
          <Route path='/react' element={<Home />} />
          <Route path='/react/services' element={<Services />} />
          <Route path='/react/pricing' element={<Pricing />} />
          <Route path='/react/contact' element={<Contact />} />
          <Route path='/react/customer' element={<Customer />} />
          <Route path='/react/customer/:licenseRef' element={<Customer />} />
          <Route path='/react/payment' element={<Payment />} />
          <Route path='/react/paid' element={<Paid />} />
          <Route path='/react/quote/:id' element={<Quote />} />
        </Routes>
        <Footer />
      </div>
    {/* <ScriptTag isHydrating={true} type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js" />
    <ScriptTag isHydrating={true} type="text/javascript" src="js/bootstrap.min.js" />
    <ScriptTag isHydrating={true} type="text/javascript" src="js/popper.min.js" /> */}
    </>
  );
}

export default App;
