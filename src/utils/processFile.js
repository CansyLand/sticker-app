import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { logo } from './privatsachen-logo.js';


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

        const pageWidth = mmToPoints(210);  // A4 width in mm
        const pageHeight = mmToPoints(297); // A4 height in mm
        
        const stickerWidth = pageWidth / 2;  // A6 width (half of A4)
        const stickerHeight = pageHeight / 2; // A6 height (half of A4)

        const stickersPerPage = 4;
        const totalRows = jsonData.length;
        const totalPages = Math.ceil(totalRows / stickersPerPage);

        const pdfContent = [];

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const pageContent = {
                stack: [],
                pageBreak: pageIndex < totalPages - 1 ? 'after' : '', // Add a page break after every page except the last one
                // absolutePosition: { x: 0, y: 0 }, // Start at the top-left corner
            };
            
            for (let stickerIndex = 0; stickerIndex < stickersPerPage; stickerIndex++) {
                const rowIndex = pageIndex * stickersPerPage + stickerIndex;
                
                if (rowIndex >= totalRows) {
                    break; // No more rows to process
                }

                const rowData = jsonData[rowIndex];

                const bezeichnung = rowData['bezeichnung'];
                const warengruppe = rowData['warengruppe'];
                const model = rowData['kurzbezeichnung']; // model
                const articlelNr = rowData['artikel_nr'];
                const composition = rowData['qualitaet1_hinweis']; // 100% Seide
                const size = rowData['farb_bezeichnung'];
                // Waschsymbole
                const madeIn = rowData['ursprungsland'];
                const dateOfManufacture = rowData['erstelldatum'];
                
                // Generate content for this sticker based on rowData
                // const stickerContent = {
                //     stack: [
                //         {
                //             canvas: [
                //                 {
                //                     type: 'rect',
                //                     x: 0,
                //                     y: 0,
                //                     w: stickerWidth,
                //                     h: stickerHeight,
                //                     lineWidth: 1,
                //                     lineColor: 'black'
                //                 }
                //             ]
                //         },
                //         // {
                //         //     margin: [5, 5, 5, 5], // Optional: Add some margin inside the canvas for the text
                //         //     stack: [
                //         //         { text: bezeichnung, style: 'stickerText', alignment: 'center' },
                //         //         { text: warengruppe, style: 'stickerText', alignment: 'center' },
                //         //         { text: model, style: 'stickerText', alignment: 'center' },
                //         //         { text: articlelNr, style: 'stickerText', alignment: 'center' },
                //         //         { text: composition, style: 'stickerText', alignment: 'center' },
                //         //         { text: size, style: 'stickerText', alignment: 'center' },
                //         //         { text: madeIn, style: 'stickerText', alignment: 'center' },
                //         //         { text: dateOfManufacture, style: 'stickerText', alignment: 'center' },
                //         //     ]
                //         // }
                //     ],
                //     width: stickerWidth,
                //     absolutePosition: {
                //         x: (stickerIndex % 2) * stickerWidth, // No need to adjust for centering
                //         y: Math.floor(stickerIndex / 2) * stickerHeight, // No need to adjust for centering
                //     },
                //     alignment: 'center'
                // };

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
                        x: (stickerIndex % 2) * stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
                        y: Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
                    }
                };

                //const logoPosition

                const stickerContent = {
                    stack: [
                        { svg: logo, width: 150, absolutePosition: { 
                            x: 0, 
                            y: 250, } },
                        { svg: logo, width: 500 },
                        { text: stickerIndex, style: 'stickerText', alignment: 'center' },
                        { text: bezeichnung, style: 'stickerText', alignment: 'center' },
                        { text: warengruppe, style: 'stickerText', alignment: 'center' },
                        { text: model, style: 'stickerText', alignment: 'center' },
                        { text: articlelNr, style: 'stickerText', alignment: 'center' },
                        { text: composition, style: 'stickerText', alignment: 'center' },
                        { text: size, style: 'stickerText', alignment: 'center' },
                        { text: madeIn, style: 'stickerText', alignment: 'center' },
                        { text: dateOfManufacture, style: 'stickerText', alignment: 'center' },
                    ],
                    absolutePosition: {
                        x: (stickerIndex % 2) * pageWidth - stickerWidth, // 0 for the first and third canvas, stickerWidth for the second and fourth
                        y: Math.floor(stickerIndex / 2) * stickerHeight, // 0 for the first and second canvas, stickerHeight for the third and fourth
                    }
                };
                
                
                
                pageContent.stack.push(stickerBorder);
                pageContent.stack.push(stickerContent);
            }

            pdfContent.push(pageContent);
        }

        const pdfDocDefinition = {
            content: pdfContent,
            pageSize: 'A4',
            pageMargins: [10, 10, 10, 10], // Adjust as needed
            styles: {
                stickerText: {
                    fontSize: 10, // Adjust as needed
                    margin: [0, 2], // [horizontal, vertical] margin. Adjust as needed
                }
            }
        };

        //pdfMake.createPdf(pdfDocDefinition).download('Stickers.pdf');
        pdfMake.createPdf(pdfDocDefinition).getDataUrl(callback);


        
      };
  
      reader.readAsBinaryString(file);
};

export default processFile;
