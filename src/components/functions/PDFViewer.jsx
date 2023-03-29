import '../../css/payment-method.css'
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack5'
import close from '../../assets/icons/x.png'

const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
pdfjs.GlobalWorkerOptions.workerSrc = url

export default function PDFViewer({ invoicePDF, isOpen, invoiceID }) {
  function downloadInvoice() {
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
        link.parentNode.removeChild(link)
      })
      .catch(() => {})
  }

  document.onclick = function (e) {
    if (e.target.id == 'bg') {
      isOpen(false)
    }
    if (e.target.id === 'doc') {
      return
    }
  }

  return (
    <div className='PDFviewer' id='bg'>
      <Document className='PDFinvoice' file={invoicePDF} id='doc'>
        <Page pageNumber={1} />
        <img className='PDF-close' src={close} alt='' onClick={() => isOpen(false)} />
        <div className='PDF-button-container'>
          <button className='btn btn-purple-radius mb-3 PDF-download' onClick={downloadInvoice}>
            Download
          </button>
        </div>
      </Document>
    </div>
  )
}

// onClick={() => downloadInvoice(invoicePDF, 'fix.glass invoice')}
