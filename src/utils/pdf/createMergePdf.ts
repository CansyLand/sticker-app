// import { PDFDocument } from 'pdf-lib'
// import pdfMake from 'pdfmake/build/pdfmake'

// export function createMergedPdf(callback: (arg0: string) => void) {
// 	pdfMake
// 		.createPdf(pdfDocDefinition)
// 		.getBuffer(async (buffer: Iterable<number>) => {
// 			const existingPdfBytes = new Uint8Array(buffer)
// 			const pdfDoc = await PDFDocument.load(existingPdfBytes)

// 			const newPdfDoc = await PDFDocument.create()

// 			for (let i = 0; i < pdfDoc.getPageCount(); i += 4) {
// 				const [page1, page2, page3, page4] = [
// 					pdfDoc.getPages()[i],
// 					pdfDoc.getPages()[i + 1],
// 					pdfDoc.getPages()[i + 2],
// 					pdfDoc.getPages()[i + 3],
// 				]

// 				const newPage = newPdfDoc.addPage([
// 					2 * page1.getWidth(),
// 					2 * page1.getHeight(),
// 				])

// 				newPage.drawPage(page1, { x: 0, y: page1.getHeight() })
// 				if (page2)
// 					newPage.drawPage(page2, { x: page1.getWidth(), y: page1.getHeight() })
// 				if (page3) newPage.drawPage(page3, { x: 0, y: 0 })
// 				if (page4) newPage.drawPage(page4, { x: page1.getWidth(), y: 0 })
// 			}

// 			const mergedPdfBytes = await newPdfDoc.save()
// 			const mergedPdfDataUrl = `data:application/pdf;base64,${Buffer.from(
// 				mergedPdfBytes
// 			).toString('base64')}`

// 			callback(mergedPdfDataUrl)
// 		})
// }
export {}
