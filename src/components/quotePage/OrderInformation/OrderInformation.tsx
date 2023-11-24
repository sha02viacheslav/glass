import './OrderInformation.css'
import React, { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { PdfViewer } from '@glass/components/PdfViewer'
import { SelectOfferNew } from '@glass/components/quotePage/SelectOfferNew'
import { PaymentStatus } from '@glass/enums'
import { InvoicePdf, Offer, OptionalOrderLine, Quote } from '@glass/models'
import { getInvoicePdfService } from '@glass/services/apis/get-invoice-pdf.service'
import { paymentStatusText } from '@glass/utils/payment-status/payment-status-text.util'

export type OrderInformationProps = {
  offerDetails?: Offer[]
  optionalOrderLines?: OptionalOrderLine[]
  quoteDetails?: Quote
  qid: string | undefined
  totalPrice: number
  totalUnitPrice: number
  onCheckOptionalOrderLine?: (orderLineId: number, optionalLineId: number, checked: boolean) => void
}

export const OrderInformation: React.FC<OrderInformationProps> = ({
  offerDetails,
  optionalOrderLines,
  quoteDetails,
  qid,
  totalPrice,
  totalUnitPrice,
  onCheckOptionalOrderLine,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.NOT_PAID)
  const [invoicePDF, setInvoicePDF] = useState<InvoicePdf | undefined>()
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoiceMessage, setInvoiceMessage] = useState('')

  const retrieveInvoice = () => {
    if (!qid) return
    trackPromise(
      getInvoicePdfService(qid)
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

  useEffect(() => {
    setPaymentStatus(quoteDetails?.invoice_data?.payment_state || PaymentStatus.NOT_PAID)
  }, [quoteDetails?.invoice_data?.payment_state])

  return (
    <div>
      <SelectOfferNew
        selectOfferToCustomer={offerDetails || []}
        optionalOrderLines={optionalOrderLines}
        totalPrice={totalPrice}
        totalUnitPrice={totalUnitPrice}
        onCheckOptionalOrderLine={onCheckOptionalOrderLine}
      />

      <div className='PM-status px-3 mt-3'>
        <span className='text-primary'>Status</span>{' '}
        <span className={paymentStatus}>{paymentStatusText(quoteDetails)}</span>
      </div>

      <div>
        <div className='d-flex justify-content-end p-3'>
          <button className='btn-stroked round' onClick={retrieveInvoice}>
            Download Receipt
          </button>
        </div>
        {!!invoiceMessage && <div className='PM-invoice-status'>{invoiceMessage}</div>}
      </div>

      {showInvoice && !!invoicePDF && <PdfViewer invoicePDF={invoicePDF} isOpen={handleInvoicePopup} />}
    </div>
  )
}
