// mergePdf.js
import { PDFDocument } from 'pdf-lib';

export async function mergePages(originalPdfBuffer) {
    const pdfDoc = await PDFDocument.load(originalPdfBuffer);
    
    const newPdfDoc = await PDFDocument.create();
    
    const pages = pdfDoc.getPages();
    console.log(`Total pages in original PDF: ${pages.length}`);

    for (let i = 0; i < pages.length; i += 4) {
    // for (let i = 0; i < 88; i += 4) {
        const [embeddedPage1, embeddedPage2, embeddedPage3, embeddedPage4] = await Promise.all([
            i < pages.length ? newPdfDoc.embedPage(pages[i]) : null,
            i + 1 < pages.length ? newPdfDoc.embedPage(pages[i + 1]) : null,
            i + 2 < pages.length ? newPdfDoc.embedPage(pages[i + 2]) : null,
            i + 3 < pages.length ? newPdfDoc.embedPage(pages[i + 3]) : null,
        ]);

        // console.log(`Processing pages: ${i}, ${i + 1}, ${i + 2}, ${i + 3}`);
        // console.log(`Page existence: ${!!embeddedPage1}, ${!!embeddedPage2}, ${!!embeddedPage3}, ${!!embeddedPage4}`);

        const pageWidth = pages[i].getWidth();
        const pageHeight = pages[i].getHeight();

        const newPage = newPdfDoc.addPage([2 * pageWidth, 2 * pageHeight]);

        if (embeddedPage1) newPage.drawPage(embeddedPage1, { x: 0, y: pageHeight });
        if (embeddedPage2) newPage.drawPage(embeddedPage2, { x: pageWidth, y: pageHeight });
        if (embeddedPage3) newPage.drawPage(embeddedPage3, { x: 0, y: 0 });
        if (embeddedPage4) newPage.drawPage(embeddedPage4, { x: pageWidth, y: 0 });
    }

    const mergedPdfBytes = await newPdfDoc.save();
    // const mergedPdfDataUrl = `data:application/pdf;base64,${Buffer.from(mergedPdfBytes).toString('base64')}`;
    // const mergedPdfDataUrl = `data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(mergedPdfBytes)))}`;
    // const mergedPdfDataUrl = `data:application/pdf;base64,${uint8ArrayToBase64(mergedPdfBytes)}`;
    // console.log(mergedPdfDataUrl)

    // downloadPdf(mergedPdfBytes)
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
    // return mergedPdfDataUrl;
}

function uint8ArrayToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function downloadPdf(mergedPdfBytes) {
    // Convert bytes to a Blob
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    // Create an Object URL from the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'merged.pdf';  // You can specify a filename here

    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
