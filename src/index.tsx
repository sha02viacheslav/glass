import React from 'react'
import ReactDOM from 'react-dom/client'
import TagManager from 'react-gtm-module'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'

const tagManagerArgs = {
  gtmId: 'GTM-PXMKJFW',
}

TagManager.initialize(tagManagerArgs)

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// @ts-ignore
reportWebVitals()
