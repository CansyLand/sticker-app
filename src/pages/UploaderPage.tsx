import { useState } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import FileDropzone from 'components/upload/FileDropzone'
import Loading from 'components/common/Loading'
import Navbar from 'components/common/Navbar'
import DatePickerModal from 'components/upload/DatePickerModal'

pdfMake.vfs = pdfFonts.pdfMake.vfs

function UploaderPage() {
	const [pdfDataUrl, setPdfDataUrl] = useState(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(true)
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)

	const handleCloseModal = () => {
		setIsModalOpen(false)
	}
	const handleContinue = (date: Date | null) => {
		setSelectedDate(date) // Save the selected date
		setIsModalOpen(false) // Close the modal
	}

	const handleFileProcessed = (dataUrl: any) => {
		setPdfDataUrl(dataUrl)
		setIsProcessing(false)
	}

	return (
		<div className='flex flex-col w-full h-screen border-opacity-50'>
			<Navbar></Navbar>
			<div className='flex-grow grid card bg-base-300 rounded-box place-items-center'>
				{isProcessing ? (
					<Loading></Loading>
				) : pdfDataUrl ? (
					<iframe
						title='Generated PDF'
						src={pdfDataUrl}
						width='100%'
						height='100%'
					></iframe>
				) : (
					<FileDropzone
						onFileProcessed={handleFileProcessed}
						onStartProcessing={() => setIsProcessing(true)}
						selectedDate={selectedDate}
					/>
				)}
			</div>
			{isModalOpen && (
				<DatePickerModal
					onClose={handleCloseModal}
					onContinue={handleContinue}
				/>
			)}
		</div>
	)
}

export default UploaderPage
