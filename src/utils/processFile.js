import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { mergePages } from './mergePdf';
import checkAndUpdateDatabase from './checkAndUpdateDatabase.js';

import { logo } from './privatsachen-logo.js';
import { eacLogo } from './eac-logo.js'


// Memo for later seperate pdf generation in own file

const { vfs } = vfsFonts.pdfMake;
pdfMake.vfs = vfs;

const processFile = (file, callback) => {
    if (!file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        console.error("Invalid file type");
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
    
        // Assuming the first sheet is the one you're interested in
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
    
        // Convert the worksheet to JSON
        // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const jsonData = XLSX.utils.sheet_to_json(worksheet);    

        checkAndUpdateDatabase(jsonData, (translationTable) => {
            console.log("Updated Database Data:", translationTable);

            // pdfMake.createPdf(pdfDocDefinition).getDataUrl(callback);

            const mmToPoints = (mm) => (mm * 72) / 25.4;

            const a4Width = mmToPoints(210);
            const a4Height = mmToPoints(297);

            const pageWidth = a4Width / 2;  // A4 width in mm
            const pageHeight = a4Height / 2; // A4 height in mm
            
            const stickerWidth = pageWidth; // / 2;  // A6 width (half of A4)
            const stickerHeight = pageHeight; // / 2; // A6 height (half of A4)

            // const stickersPerPage = 4;
            const totalRows = jsonData.length;
            // const totalPages = Math.ceil(totalRows / stickersPerPage);

            const pdfContent = [];

            for (let pageIndex = 0; pageIndex < totalRows; pageIndex++) {
                const pageContent = {
                    stack: [],
                    pageBreak: pageIndex < totalRows - 1 ? 'after' : '', // Add a page break after every page except the last one
                };
                
                if (pageIndex >= totalRows) {
                    break; // No more rows to process
                }

                const rowData = jsonData[pageIndex];

                
                
                

                const bezeichnung = rowData['bezeichnung'];
                const warengruppe = rowData['warengruppe'];
                const model = rowData['kurzbezeichnung']; // model
                const articlelNr = rowData['artikel_nr'];
                const composition = rowData['qualitaet1_hinweis']; // 100% Seide
                const size = rowData['farb_bezeichnung'];
                // Waschsymbole
                const madeIn = rowData['ursprungsland'];
                const dateOfManufacture = rowData['erstelldatum'];

            

                const stickerBorder = {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: stickerWidth,
                            h: stickerHeight,
                            lineWidth: 1,
                            lineColor: 'black'
                        },
                        { text: bezeichnung, style: 'stickerText', alignment: 'center' },
                    ],
                    absolutePosition: {
                        x: 0, //(stickerIndex % 2) * stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
                        y: 0 //Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
                    }
                };

                const languages = ['de', 'en', 'ru'];

                const stickerContent = {
                    stack: [
                        { svg: logo, width: 150, x: 67, y: 0 },
                        // { text: pageIndex, style: 'stickerText', alignment: 'center' },
                        { text: 'Cocon Commerz GmbH', style: 'stickerText', alignment: 'center', margin: [0, 1, 0, 0] },
                        { text: 'Wendenstraße 404, 20537 Hamburg', style: 'stickerText', alignment: 'center' },
                        { text: 'Germany', style: 'stickerText', alignment: 'center' },

                        // { text: bezeichnung, style: 'stickerText', alignment: 'center', margin: [0, 20, 0, 0] },
                        { text: translate(translationTable, warengruppe, languages) , style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },
                        { text: 'Modell / Type / Модель: ' + model, style: 'stickerText', alignment: 'center' },
                        
                        { text: translate(translationTable, composition, languages), style: 'stickerText', alignment: 'center' },

                        { text: 'Größe/ Size/ Размер: ' + translate(translationTable, size, ['de'] ), style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },
                        // { text: translate(translationTable, size, ['de'] ), style: 'stickerText', alignment: 'center' },

                        
                        { text: 'Intensive Farben separat waschen.\nWash intensive colours separately.\nИнтенсивный окрас, стирать отдельно.', style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },

                        { text: 'Artikel / Article / Артикул: ' + articlelNr, style: 'stickerText', alignment: 'center', margin: [0, 20, 0, 0]  },
                        { text: translate(translationTable, madeIn, languages), style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },

                        { text: 'Herstellungsdatum\nDate of manufacture\nДата изготовления:', style: 'stickerText', alignment: 'center', margin: [0, 10, 0, 0] },
                        { text: excelDateToJSDate(dateOfManufacture), style: 'stickerText', alignment: 'center', margin: [0, 0, 0, 15] },
                        { svg: eacLogo, width: 40, x: 120, y: 0 },
                    ],
                    // absolutePosition: {
                    //     x: (stickerIndex % 2) * pageWidth - stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
                    //     y: Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
                    // }
                };
                
                
                
                pageContent.stack.push(stickerBorder);
                pageContent.stack.push(stickerContent);

                pdfContent.push(pageContent);
            }

            const pdfDocDefinition = {
                content: pdfContent,
                pageSize: 'A6',
                pageMargins: [10, 10, 10, 10], // Adjust as needed
                styles: {
                    stickerText: {
                        fontSize: 10, // Adjust as needed
                        margin: [0, 2], // [horizontal, vertical] margin. Adjust as needed
                    }
                }
            };

            // pdfMake.createPdf(pdfDocDefinition).download('Stickers.pdf');
            // pdfMake.createPdf(pdfDocDefinition).getDataUrl(callback);

            // Merges 4 sticker to one page
            pdfMake.createPdf(pdfDocDefinition).getBuffer(async (buffer) => {
                const mergedPdfDataUrl = await mergePages(buffer);
                callback(mergedPdfDataUrl);
            });
        });


        
      };
  
      reader.readAsBinaryString(file);
};

export default processFile;


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

function translate(translationTable, val, languages) {
    if (!Array.isArray(languages)) {
        languages = [languages];
    }

    const entry = translationTable.find(item => item.val === val);
    if (!entry) {
        return val;
    }

    const translations = languages.map(lang => entry[lang] || val).join(' / ');
    return translations;
}

function excelDateToJSDate(serial) {
    // Excel's epoch starts on 1900-01-01, but it thinks 1900 was a leap year (it wasn't).
    // So, we adjust for this by subtracting 1 for dates after 1900-02-28 (serial number 60).
    let epoch = new Date(1900, 0, 1);
    if (serial >= 60) {
        serial--;
    }
    let date = new Date(epoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);

    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because getMonth() returns 0-11
    return month + ". " + date.getFullYear();

}