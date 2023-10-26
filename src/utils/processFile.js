import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { logo } from './privatsachen-logo.js';
import { mergePages } from './mergePdf';


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
    
        // Access the first row (excluding the header)
        // const row = jsonData[0];
    

        // Continue with your PDF generation logic...
        // const pdfDocDefinition = {
        //   content: [
        //     bezeichnung + '\n'
        //     + warengruppe + '\n'
        //     + model + '\n'
        //     + articlelNr + '\n'
        //     + composition + '\n'
        //     + size + '\n'
        //     + madeIn + '\n'
        //     + dateOfManufacture + '\n',
        //     // Add your processed data here
        //   ],
        // };
    
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
            
            // for (let stickerIndex = 0; stickerIndex < stickersPerPage; stickerIndex++) {
            //     const rowIndex = pageIndex * stickersPerPage + stickerIndex;
                
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



                const stickerContent = {
                    stack: [
                        { svg: logo, width: 150, x: 67, y: 100 },
                        // { text: pageIndex, style: 'stickerText', alignment: 'center' },
                        { text: 'Cocon Commerz GmbH', style: 'stickerText', alignment: 'center', margin: [0, 20, 0, 0] },
                        { text: 'Wendenstraße 404, 20537 Hamburg', style: 'stickerText', alignment: 'center' },
                        { text: 'Germany', style: 'stickerText', alignment: 'center' },
                        { text: bezeichnung, style: 'stickerText', alignment: 'center', margin: [0, 20, 0, 0] },
                        { text: warengruppe, style: 'stickerText', alignment: 'center' },
                        { text: model, style: 'stickerText', alignment: 'center' },
                        { text: articlelNr, style: 'stickerText', alignment: 'center' },
                        { text: composition, style: 'stickerText', alignment: 'center' },
                        { text: size, style: 'stickerText', alignment: 'center' },
                        { text: madeIn, style: 'stickerText', alignment: 'center' },
                        { text: dateOfManufacture, style: 'stickerText', alignment: 'center' },
                    ],
                    // absolutePosition: {
                    //     x: (stickerIndex % 2) * pageWidth - stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
                    //     y: Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
                    // }
                };
                
                
                
                pageContent.stack.push(stickerBorder);
                pageContent.stack.push(stickerContent);
            //}

            pdfContent.push(pageContent);
        }

        const pdfDocDefinition = {
            content: pdfContent,
            pageSize: 'A6',
            pageMargins: [10, 100, 10, 10], // Adjust as needed
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


        
      };
  
      reader.readAsBinaryString(file);
};

export default processFile;
