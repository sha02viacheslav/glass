import React, { useState } from 'react'
import { Box, CardMedia } from '@mui/material'
import { trackPromise } from 'react-promise-tracker'
import { PdfViewer } from '@glass/components/PdfViewer'
import { InvoicePdf } from '@glass/models'
import { getInvoicePdfService } from '@glass/services/apis/get-invoice-pdf.service'

export type DownloadInvoiceProps = {
  quoteId: string
}

export const DownloadInvoice: React.FC<DownloadInvoiceProps> = ({ quoteId }) => {
  const [invoicePDF, setInvoicePDF] = useState<InvoicePdf | undefined>()
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceMessage, setInvoiceMessage] = useState('')

  const retrieveInvoice = () => {
    if (!quoteId) return
    console.warn('quoteId', quoteId)
    trackPromise(
      getInvoicePdfService(quoteId)
        .then((res) => {
          if (res.success) {
            if (res.data.pdf_content !== '') {
              setInvoicePDF(res.data)
              setShowInvoice(true)
              setInvoiceMessage('')
            } else {
              setInvoiceMessage('Receipt is available after payment. Select the payment method below and pay online.')
            }
          }
        })
        .catch(() => {
          setShowInvoice(false)
        }),
    )
  }

  const handleInvoicePopup = (status: boolean) => {
    setShowInvoice(status)
  }

  return (
    <>
      <button type='button' className='btn-link small fw-n' onClick={retrieveInvoice}>
        <CardMedia
          component='img'
          sx={{ width: 16, height: 16 }}
          image={process.env.PUBLIC_URL + '/images/receipt.svg'}
        />
        Download Receipt
      </button>
      {!!invoiceMessage && <Box className='formError'>{invoiceMessage}</Box>}
      {showInvoice && !!invoicePDF && <PdfViewer invoicePDF={invoicePDF} isOpen={handleInvoicePopup} />}
    </>
  )
}
