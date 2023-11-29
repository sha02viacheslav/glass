import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  ) : (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// @ts-ignore
reportWebVitals()
