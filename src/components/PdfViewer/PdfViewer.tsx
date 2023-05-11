import './pdf-viewer.css'
import React, { useState, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { trackPromise } from 'react-promise-tracker'
import close from '@glass/assets/icons/x.png'
import { Loader } from '@glass/components/Loader'
import { InvoicePdf } from '@glass/models'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export type PdfViewerProps = {
  invoicePDF: InvoicePdf
  isOpen: (value: boolean) => void
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ invoicePDF, isOpen }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const invoiceID = useMemo(() => {
    return invoicePDF?.invoice_pdf_url?.split('?')?.[0]?.split('/')?.at(-1) || ''
  }, [invoicePDF])

  const downloadInvoice = () => {
    trackPromise(
      fetch(invoicePDF.pdf_content)
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
        .catch(() => {}),
    )
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
        <Document className='pdf-invoice' file={invoicePDF.pdf_content} onLoadSuccess={() => setLoading(false)}>
          <Page pageNumber={1} />
          <img className='PDF-close' src={close} alt='' onClick={() => isOpen(false)} />
          <div className='PDF-button-container'>
            <button className='btn-raised round mb-3' onClick={downloadInvoice}>
              Download Receipt
            </button>
          </div>
        </Document>

        <Loader loading={loading} />
      </div>
    </div>
  )
}
