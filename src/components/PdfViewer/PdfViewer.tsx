import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import close from '../../assets/icons/x.png'
import './pdf-viewer.css'

const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
pdfjs.GlobalWorkerOptions.workerSrc = url

export type PdfViewerProps = {
  invoicePDF: string
  isOpen: (value: boolean) => void
  invoiceID: string
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ invoicePDF, isOpen, invoiceID }) => {
  const downloadInvoice = () => {
    fetch(invoicePDF)
      .then((res) => res.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', invoiceID + '.pdf')
        // Append to html link element page
        document.body.appendChild(link)
        // Start download
        link.click()
        // Clean up and remove the link
        link?.parentNode?.removeChild(link)
      })
      .catch(() => {})
  }

  return (
    <div
      className='pdf-viewer'
      onClick={() => {
        isOpen(false)
      }}
    >
      <div
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
      >
        <Document className='pdf-invoice' file={invoicePDF}>
          <Page pageNumber={1} />
          <img className='PDF-close' src={close} alt='' onClick={() => isOpen(false)} />
          <div className='PDF-button-container'>
            <button className='btn btn-purple-radius mb-3 PDF-download' onClick={downloadInvoice}>
              Download
            </button>
          </div>
        </Document>
      </div>
    </div>
  )
}
