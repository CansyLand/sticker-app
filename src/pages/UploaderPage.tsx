import React, { useState } from 'react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import FileDropzone from 'components/FileDropzone'
import Loading from 'components/common/Loading'
import Navbar from 'components/common/Navbar'
pdfMake.vfs = pdfFonts.pdfMake.vfs

function UploaderPage() {
	const [pdfDataUrl, setPdfDataUrl] = useState(null)
	const [isProcessing, setIsProcessing] = useState(false)

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
					/>
				)}
			</div>
		</div>
	)
}

export default UploaderPage
