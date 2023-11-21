import React from 'react'

interface ModalProps {
	onClose: () => void
	onContinue: (date: Date | null) => void
}

const DatePickerModal: React.FC<ModalProps> = ({ onClose, onContinue }) => {
	const [dateInput, setDateInput] = React.useState('')

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value
		// Remove all non-digits and slashes
		value = value.replace(/[^0-9/]/g, '')

		// Automatically insert a slash after MM
		if (value.length === 2 && !value.includes('/')) {
			value += '/'
		}

		// Split the value into month and year
		const parts = value.split('/')
		if (parts[1] && parts[1].length > 4) {
			// If year part is longer than 4 digits, truncate it
			parts[1] = parts[1].substring(0, 4)
			value = parts.join('/')
		}

		setDateInput(value)
	}

	const handleContinue = () => {
		const [month, year] = dateInput.split('/')
		if (month && year) {
			const selectedDate = new Date(parseInt(year), parseInt(month) - 1)
			onContinue(selectedDate)
		} else {
			onContinue(null)
		}
		onClose()
	}

	return (
		<div
			className='modal modal-open'
			onClick={(e) => {
				if (e.currentTarget === e.target) onClose()
			}}
		>
			<div className='modal-box' onClick={(e) => e.stopPropagation()}>
				<h3 className='font-bold text-lg'>Produktions Datum</h3>
				<input
					type='text'
					placeholder='MM/YYYY'
					value={dateInput}
					pattern='(0[1-9]|1[0-2])\/[0-9]{4}'
					className='input input-bordered w-full'
					onChange={handleInputChange}
				/>
				<div className='modal-action justify-between'>
					<button onClick={onClose} className='btn btn-outline w-5/12'>
						Ignorieren
					</button>
					<button onClick={handleContinue} className='btn btn-primary w-5/12'>
						Weiter
					</button>
				</div>
			</div>
		</div>
	)
}

export default DatePickerModal
