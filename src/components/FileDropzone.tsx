import { useRef } from 'react'
import processFile from 'utils/pdf/processFile'
interface FileDropzoneProps {
	onFileProcessed: (file: File) => void
	onStartProcessing: () => void
}
function FileDropzone({
	onFileProcessed,
	onStartProcessing,
}: FileDropzoneProps) {
	const fileInputRef = useRef(null)

	const handleDrop = (e: any) => {
		e.preventDefault()
		const files = e.dataTransfer.files
		if (files.length) {
			handleFiles(files)
		}
	}

	const handleDragOver = (e: any) => {
		e.preventDefault()
	}

	const handleFiles = (files: any) => {
		// Notify the parent component that processing is starting
		if (onStartProcessing) {
			onStartProcessing()
		}

		// Process the files here
		console.log(files)
		processFile(files[0], onFileProcessed)
	}

	const openFilePicker = () => {
		//fileInputRef.current.click();
	}

	const handleFileChange = (e: any) => {
		if (e.target.files.length) {
			handleFiles(e.target.files)
		}
	}

	return (
		<div className='w-full h-full p-7'>
			<label
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onClick={openFilePicker}
				className='flex justify-center  w-full h-full px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none'
			>
				<span className='flex items-center space-x-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-6 h-6 text-gray-600'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
						/>
					</svg>
					<span className='font-medium text-gray-600'>
						.xlsx Tabelle hierher ziehen, oder
						<span className='text-blue-600 underline'> suchen</span>
					</span>
				</span>
				<input
					ref={fileInputRef}
					onChange={handleFileChange}
					type='file'
					name='file_upload'
					className='hidden'
				/>
			</label>
		</div>
	)
}

export default FileDropzone
