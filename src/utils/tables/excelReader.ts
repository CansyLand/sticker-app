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
			let jsonData = XLSX.utils.sheet_to_json(worksheet)

			// Duplicate each row according to its 'bestellmenge' value.
			jsonData = transformData(jsonData)

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

/**
 * Transforms the input data by duplicating each row based on its 'bestellmenge' value.
 *
 * @param data - Array of data objects to be transformed.
 * @returns Transformed array with duplicated rows.
 */
const transformData = (data: any[]) => {
	let transformedData: any = []

	data.forEach((row) => {
		const count = row.bestellmenge || 1 // Default to 1 if bestellmenge is not provided
		transformedData.push(row) // Push the original row first
		for (let i = 1; i < count; i++) {
			// Start from 1 as original row is already added
			transformedData.push({ ...row })
		}
	})

	return transformedData
}

export { readExcelFile }
