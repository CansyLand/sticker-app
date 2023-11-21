import { generatePDF } from './pdfGenerator'
import { readExcelFile } from '../tables/excelReader'
import checkAndUpdateDatabase from '../database/databaseOperations'

const processFile = (file: Blob, callback: any) => {
	readExcelFile(file, (jsonData) => {
		checkAndUpdateDatabase(jsonData, (translationTable: any) => {
			generatePDF(jsonData, translationTable, callback)
		})
	})
}

export default processFile

// import pdfMake from 'pdfmake/build/pdfmake';
// import vfsFonts from 'pdfmake/build/vfs_fonts';
// import { readExelFile } from 'utils/tables/excelReader.js';
// // import * as XLSX from 'xlsx';
// import { mergePages } from './mergePdf.js';

// import { logo } from '../../graphics/privatsachen-logo.js';
// import { eacLogo } from '../../graphics/eac-logo.js'

// import { waeschefont } from '../../graphics/font.js'

// vfsFonts.pdfMake.vfs["waesche7.ttf"] = waeschefont;

// const { vfs } = vfsFonts.pdfMake;
// pdfMake.vfs = vfs;

// pdfMake.fonts = {
//     Roboto: {
//         normal: 'Roboto-Regular.ttf',
//         bold: 'Roboto-Medium.ttf',
//         italics: 'Roboto-Italic.ttf',
//         bolditalics: 'Roboto-MediumItalic.ttf'
//       },
//     waesche7: {
//         normal: 'waesche7.ttf'
//     },
//   }

// const processFile = (file, callback) => {
// if (!file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
//     console.error("Invalid file type");
// }

// const reader = new FileReader();

// reader.onload = (e) => {
// const data = e.target.result;
// const workbook = XLSX.read(data, { type: 'binary' });

// Assuming the first sheet is the one you're interested in
// const firstSheetName = workbook.SheetNames[0];
// const worksheet = workbook.Sheets[firstSheetName];

// Convert the worksheet to JSON
// const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
// const jsonData = XLSX.utils.sheet_to_json(worksheet);

// checkAndUpdateDatabase(jsonData, (translationTable) => {
// console.log("Updated Database Data:", translationTable);

// pdfMake.createPdf(pdfDocDefinition).getDataUrl(callback);

// const mmToPoints = (mm) => (mm * 72) / 25.4;

// const a4Width = mmToPoints(210);
// const a4Height = mmToPoints(297);

// const pageWidth = a4Width / 2;  // A4 width in mm
// const pageHeight = a4Height / 2; // A4 height in mm

// const stickerWidth = pageWidth; // / 2;  // A6 width (half of A4)
// const stickerHeight = pageHeight; // / 2; // A6 height (half of A4)

// // const stickersPerPage = 4;
// const totalRows = jsonData.length;
// // const totalPages = Math.ceil(totalRows / stickersPerPage);

// const pdfContent = [];

// for (let pageIndex = 0; pageIndex < totalRows; pageIndex++) {
// const pageContent = {
//     stack: [],
//     pageBreak: pageIndex < totalRows - 1 ? 'after' : '', // Add a page break after every page except the last one
// };

// if (pageIndex >= totalRows) {
//     break; // No more rows to process
// }

// const rowData = jsonData[pageIndex];

// const bezeichnung = rowData['bezeichnung'];
// const warengruppe = rowData['warengruppe'];
// const model = rowData['kurzbezeichnung']; // model
// const articlelNr = rowData['artikel_nr'];
// const composition = rowData['qualitaet1_hinweis']; // 100% Seide
// const size = rowData['farb_bezeichnung'];
// // Waschsymbole
// const madeIn = rowData['ursprungsland'];
// const dateOfManufacture = rowData['erstelldatum'];

// const stickerBorder = {
//     canvas: [
//         {
//             type: 'rect',
//             x: 0,
//             y: 0,
//             w: stickerWidth,
//             h: stickerHeight,
//             lineWidth: 1,
//             lineColor: 'white'
//         },
//         { text: bezeichnung, style: 'stickerText', alignment: 'center' },
//     ],
//     absolutePosition: {
//         x: 0, //(stickerIndex % 2) * stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
//         y: 0 //Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
//     }
// };

// const languages = ['de', 'en', 'ru'];

// const stickerContent = {
//     stack: [
//         { text: "", margin: [0, 20, 0, 0]},
//         { svg: logo, width: 150, x: 67, y: 0 },
//         // { text: pageIndex, style: 'stickerText', alignment: 'center' },
//         { text: 'Cocon Commerz GmbH', style: 'stickerText', alignment: 'center', margin: [0, 1, 0, 0] },
//         { text: 'Wendenstraße 404, 20537 Hamburg', style: 'stickerText', alignment: 'center' },
//         { text: 'Germany', style: 'stickerText', alignment: 'center' },

//         // { text: bezeichnung, style: 'stickerText', alignment: 'center', margin: [0, 20, 0, 0] },
//         { text: translate(translationTable, warengruppe, languages) , style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },
//         // { text: 'Modell / Type / Модель: ' + model, style: 'boldText', alignment: 'center' },
//         {
//             text: [
//                 { text: 'Modell / Type / Модель: ', style: 'stickerText' },
//                 { text: model.toUpperCase(), style: 'boldText' }
//             ],
//             alignment: 'center'
//         },

//         { text: translate(translationTable, composition, languages), style: 'stickerText', alignment: 'center' },

//         { text: 'Größe/ Size/ Размер: ' + translate(translationTable, size, ['de'] ), style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },
//         // { text: translate(translationTable, size, ['de'] ), style: 'stickerText', alignment: 'center' },

//         { text: translate(translationTable, composition, ['wash'] ), style: 'stickerText', alignment: 'center', font: 'waesche7', fontSize: 14, margin: [0, 10, 0, 0] },

//         { text: 'Intensive Farben separat waschen.\nWash intensive colours separately.\nИнтенсивный окрас, стирать отдельно.', style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },

//         { text: 'Artikel / Article / Артикул: ' + articlelNr, style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0]  },
//         { text: translate(translationTable, madeIn, languages), style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },

//         { text: 'Herstellungsdatum / Date of manufacture\nДата изготовления:', style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },
//         { text: excelDateToJSDate(dateOfManufacture), style: 'stickerText', alignment: 'center', margin: [0, 0, 0, 15] },
//         { svg: eacLogo, width: 20, x: 130, y: 0 },
//     ],
//     // absolutePosition: {
//     //     x: (stickerIndex % 2) * pageWidth - stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
//     //     y: Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
//     // }
// };

// pageContent.stack.push(stickerBorder);
// pageContent.stack.push(stickerContent);

// pdfContent.push(pageContent);
// }

// const pdfDocDefinition = {
//     content: pdfContent,
//     pageSize: 'A6',
//     pageMargins: [10, 10, 10, 10],
//     styles: {
//         stickerText: {
//             fontSize: 10,
//             margin: [0, 2], // [horizontal, vertical]
//         },
//         boldText: {
//             fontSize: 11,
//             bold: true,
//         }
//     }
// };

// pdfMake.createPdf(pdfDocDefinition).download('Stickers.pdf');
// pdfMake.createPdf(pdfDocDefinition).getDataUrl(callback);

// Merges 4 sticker to one page
// pdfMake.createPdf(pdfDocDefinition).getBuffer(async (buffer) => {
//     const mergedPdfDataUrl = await mergePages(buffer);
//     callback(mergedPdfDataUrl);
// });
// });

//   };

//   reader.readAsBinaryString(file);
// };

// export default processFile;

// function translate(translationTable, val, language) {
//     // Find the entry in the translationTable that matches the given val
//     const entry = translationTable.find(item => item.val === val);

//     // If no entry is found, return a default value or the original val
//     if (!entry) {
//         return val; // or return a default value like "N/A"
//     }

//     // Return the translation for the specified language or the original val if the translation is not available
//     return entry[language] || val;
// }

// function translate(translationTable, val, languages) {
//     if (!Array.isArray(languages)) {
//         languages = [languages];
//     }

//     const entry = translationTable.find(item => item.val === val);
//     if (!entry) {
//         return val;
//     }

//     const translations = languages.map(lang => entry[lang] || val).join(' / ');
//     return translations;
// }

// function excelDateToJSDate(serial) {
//     // Excel's epoch starts on 1900-01-01, but it thinks 1900 was a leap year (it wasn't).
//     // So, we adjust for this by subtracting 1 for dates after 1900-02-28 (serial number 60).
//     let epoch = new Date(1900, 0, 1);
//     if (serial >= 60) {
//         serial--;
//     }
//     let date = new Date(epoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);

//     let month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because getMonth() returns 0-11
//     return month + ". " + date.getFullYear();

// }
