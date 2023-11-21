import * as XLSX from 'xlsx'

// const readExcelFile = (file, callback) => {
const readExcelFile = (
	file: Blob,
	callback: { (jsonData: any): void; (arg0: unknown[]): void }
) => {
	if (
		!file ||
		file.type !==
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	) {
		console.error('Invalid file type')
		return
	}

	const reader = new FileReader()

	reader.onload = (e) => {
		if (e.target) {
			const data = e.target.result
			const workbook = XLSX.read(data, { type: 'binary' })
			const firstSheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[firstSheetName]
			const jsonData = XLSX.utils.sheet_to_json(worksheet)

			callback(jsonData) // Pass the parsed data back
		} else {
			console.error('FileReader event target is null')
		}
	}

	reader.onerror = (error) => {
		console.error('Error reading file:', error)
	}

	reader.readAsBinaryString(file)
}

export { readExcelFile }
