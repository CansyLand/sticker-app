import * as XLSX from 'xlsx';

const readExcelFile = (file, callback) => {
    if (!file || file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        console.error("Invalid file type");
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        callback(jsonData); // Pass the parsed data back
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };

    reader.readAsBinaryString(file);
};

export { readExcelFile };
