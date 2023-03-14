import '../../css/payment-method.css';
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack5";
import close from '../icons/x.png';
import axios from 'axios';

const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
pdfjs.GlobalWorkerOptions.workerSrc = url

export default function PDFViewer({invoicePDF, isOpen, qid}) {

    function downloadInvoice() {
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "params": {
                "fe_token": qid
            }
        });
        let config = {
            method: 'get',
            url: process.env.REACT_APP_GET_INVOICE_PDF_FILE,
            headers: {
                'Content-Type': 'application/json',
                // 'api-key': process.env.REACT_APP_ODOO_STAGING_KEY
            },
            data: data
        };
        axios(config)
        .then(function (response) {
            // figure out how to view pdf
            console.log(JSON.stringify(response));
        })
        .catch(function (error) {
            console.log(error);
        })

        // const aElement = document.createElement('a');
        // aElement.setAttribute('download', 'fix.glass invoice');
        // const href = URL.createObjectURL(res);
        // aElement.href = href;
        // // aElement.setAttribute('href', href);
        // aElement.setAttribute('target', '_blank');
        // aElement.click();
        // URL.revokeObjectURL(href);
    }

    return (
        <div className="PDFviewer">
            <Document className='PDFinvoice' file={invoicePDF}>
                <Page pageNumber={1} />
                <img className='PDF-close' src={close} alt="" onClick={() => isOpen(false)}/>
            </Document>
            <div className="PDF-button-container">
                <button className="btn btn-purple-radius mb-3 PDF-download" onClick={downloadInvoice}>
                    Download
                </button>
            </div>
        </div>
    );
}

// onClick={() => downloadInvoice(invoicePDF, 'fix.glass invoice')}