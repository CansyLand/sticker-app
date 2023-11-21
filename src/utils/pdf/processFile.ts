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
