import { generatePDF } from './pdfGenerator'
import { readExcelFile } from '../tables/excelReader'
import checkAndUpdateDatabase from '../database/databaseOperations'

const processFile = (file: Blob, selectedDate: Date | null, callback: any) => {
	readExcelFile(file, (jsonData) => {
		checkAndUpdateDatabase(jsonData, (translationTable: any) => {
			generatePDF(jsonData, translationTable, selectedDate, callback)
		})
	})
}

export default processFile
