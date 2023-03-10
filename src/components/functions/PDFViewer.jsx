import '../../css/payment-method.css';
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import close from '../icons/x.png';

export default function PDFViewer({invoicePDF, isOpen}) {

    function downloadInvoice(url, fileName) {
        fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
        .then(res => res.blob())
        .then(res => {
            const aElement = document.createElement('a');
            aElement.setAttribute('download', fileName);
            const href = URL.createObjectURL(res);
            aElement.href = href;
            // aElement.setAttribute('href', href);
            aElement.setAttribute('target', '_blank');
            aElement.click();
            URL.revokeObjectURL(href);
        });
    }

    return (
        <div className="PDFviewer">
            <Document className='PDFinvoice' file={invoicePDF}>
                <Page pageNumber={1} />
                <img className='PDF-close' src={close} alt="" onClick={() => isOpen(false)}/>
            </Document>
            <div className="PDF-button-container">
                <a className="btn btn-purple-radius mb-3 PDF-download">
                    Download
                </a>
            </div>
        </div>
    );
}

// onClick={() => downloadInvoice(invoicePDF, 'fix.glass invoice')}