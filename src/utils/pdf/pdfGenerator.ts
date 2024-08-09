import pdfMake from 'pdfmake/build/pdfmake'
import vfsFonts from 'pdfmake/build/vfs_fonts'
import { mergePages } from './mergePdf'
import { logo } from '../../graphics/privatsachen-logo.js'
import { eacLogo } from '../../graphics/eac-logo.js'
import { waeschefont } from '../../graphics/font.js'

import {
	translate,
	excelDateToJSDate,
	formatDateToMMYYYY,
} from './utilityFunctions'
import { TDocumentDefinitions } from 'pdfmake/interfaces'

// Set up fonts
vfsFonts.pdfMake.vfs['waesche7.ttf'] = waeschefont
const { vfs } = vfsFonts.pdfMake
pdfMake.vfs = vfs

pdfMake.fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf',
	},
	waesche7: {
		normal: 'waesche7.ttf',
	},
}

const generatePDF = (
	jsonData: any[],
	translationTable: any[],
	selectedDate: Date | null,
	callback: (arg0: string) => void
) => {
	const mmToPoints = (mm: number) => (mm * 72) / 25.4
	const a4Width = mmToPoints(210)
	const a4Height = mmToPoints(297)
	const pageWidth = a4Width / 2
	const pageHeight = a4Height / 2
	const stickerWidth = pageWidth
	const stickerHeight = pageHeight
	const totalRows = jsonData.length

	const pdfContent: any[] = []

	jsonData.forEach((rowData, pageIndex) => {
		const warengruppe = rowData['Produktgruppenbezeichnung']
		const model = rowData['Modell'] // model
		const articlelNr = rowData['Modellname']
		const composition = rowData['Materialzusammensetzung'] // 100% Seide // Waschsymbole
		const size = rowData['Größenbezeichnung']
		const madeIn =
			rowData['Ursprungsland laut Modell-/Artikelstamm (Bezeichnung)']

		const dateOfManufacture = selectedDate
			? formatDateToMMYYYY(selectedDate)
			: excelDateToJSDate(rowData['erstelldatum'])

		const stickerBorder = {
			canvas: [
				{
					type: 'rect',
					x: 0,
					y: 0,
					w: stickerWidth,
					h: stickerHeight,
					lineWidth: 1,
					lineColor: 'white', // 🔥 set to black for debug
				},
				{ text: model, style: 'stickerText', alignment: 'center' },
			],
			absolutePosition: {
				x: 0, //(stickerIndex % 2) * stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
				y: 0, //Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
			},
		}

		// You can create functions like translate in your UtilityFunctions.js module
		// and import them here to use in generating the PDF content
		const languages = ['de', 'en', 'ru']

		const stickerContent = {
			stack: [
				{ text: '', margin: [0, 20, 0, 0] },
				{ svg: logo, width: 150, x: 67, y: 0 },
				// { text: pageIndex, style: 'stickerText', alignment: 'center' },
				{
					text: 'Cocon Commerz GmbH',
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 1, 0, 0],
				},
				{
					text: 'Wendenstraße 404, 20537 Hamburg',
					style: 'stickerText',
					alignment: 'center',
				},
				{ text: 'Germany', style: 'stickerText', alignment: 'center' },

				// { text: bezeichnung, style: 'stickerText', alignment: 'center', margin: [0, 20, 0, 0] },
				{
					text: translate(translationTable, warengruppe, languages),
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 10, 0, 0],
				},
				// { text: 'Modell / Type / Модель: ' + model, style: 'boldText', alignment: 'center' },
				{
					text: [
						{ text: 'Modell / Type / Модель: ', style: 'stickerText' },
						{ text: model.toUpperCase(), style: 'boldText' },
					],
					alignment: 'center',
				},

				{
					text: translate(translationTable, composition, languages),
					style: 'stickerText',
					alignment: 'center',
				},

				{
					text:
						'Größe/ Size/ Размер: ' + translate(translationTable, size, ['de']),
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 10, 0, 0],
				},
				// { text: translate(translationTable, size, ['de'] ), style: 'stickerText', alignment: 'center' },

				{
					text: translate(translationTable, composition, ['wash']),
					style: 'stickerText',
					alignment: 'center',
					font: 'waesche7',
					fontSize: 14,
					margin: [0, 10, 0, 0],
				},

				{
					text: 'Intensive Farben separat waschen.\nWash intensive colours separately.\nИнтенсивный окрас, стирать отдельно.',
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 10, 0, 0],
				},

				{
					text: 'Artikel / Article / Артикул: ' + articlelNr,
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 10, 0, 0],
				},
				{
					text: translate(translationTable, madeIn, languages),
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 10, 0, 0],
				},

				{
					text: 'Herstellungsdatum / Date of manufacture\nДата изготовления:',
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 10, 0, 0],
				},
				{
					text: dateOfManufacture,
					style: 'stickerText',
					alignment: 'center',
					margin: [0, 0, 0, 15],
				},
				{ svg: eacLogo, width: 20, x: 130, y: 0 },
			],
			//pageBreak: pageIndex < totalRows - 1 ? 'after' : '',
		}

		const pageContent: any = {
			stack: [],
			pageBreak: pageIndex < totalRows - 1 ? 'after' : '', // Add a page break after every page except the last one
		}

		pageContent.stack.push(stickerBorder)
		pageContent.stack.push(stickerContent)

		pdfContent.push(pageContent)
	})

	const pdfDocDefinition: TDocumentDefinitions = {
		content: pdfContent,
		pageSize: 'A6',
		pageMargins: [10, 10, 10, 10],
		styles: {
			stickerText: {
				fontSize: 10,
				margin: [0, 2],
			},
			boldText: {
				fontSize: 11,
				bold: true,
			},
		},
	}

	// Download pdf
	// pdfMake.createPdf(pdfDocDefinition).download('Stickers.pdf')

	// Return individual sticker pages
	// pdfMake.createPdf(pdfDocDefinition).getDataUrl(callback)

	// Merges 4 sticker to one page
	pdfMake.createPdf(pdfDocDefinition).getBuffer(async (buffer) => {
		const mergedPdfDataUrl = await mergePages(buffer)
		callback(mergedPdfDataUrl)
	})
}

export { generatePDF }
