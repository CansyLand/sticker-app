import React from 'react'

interface ModalProps {
	onClose: () => void
	onContinue: (date: Date | null) => void
}

const DatePickerModal: React.FC<ModalProps> = ({ onClose, onContinue }) => {
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

	const handleContinue = () => {
		onContinue(selectedDate)
		onClose()
	}

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// Check if the clicked target is the modal backdrop itself
		if (e.currentTarget === e.target) {
			onClose()
		}
	}

	return (
		<div className='modal modal-open' onClick={handleBackdropClick}>
			<div className='modal-box'>
				<h3 className='font-bold text-lg'>Produktions Datum</h3>
				<input
					type='month'
					className='input input-bordered w-full' // Full width date input
					onChange={(e) => {
						const [year, month] = e.target.value.split('-')
						setSelectedDate(new Date(parseInt(year), parseInt(month) - 1))
					}}
				/>
				<div className='modal-action justify-between'>
					{' '}
					{/* Space out buttons */}
					<button onClick={onClose} className='btn btn-outline w-5/12'>
						Ignorieren
					</button>{' '}
					{/* Slightly less than half width */}
					<button onClick={handleContinue} className='btn btn-primary w-5/12'>
						Weiter
					</button>{' '}
					{/* Slightly less than half width */}
				</div>
			</div>
		</div>
	)
}

export default DatePickerModal
