import React, { useState, useEffect } from 'react'
import useUpdateRow from 'hooks/useUpdateRow'

const apiUrl = process.env.REACT_APP_API_ENDPOINT

type InputStatus = 'default' | 'changed' | 'success' | 'error'
interface InputStatusState {
	[key: string]: InputStatus
}

function TableRow({ tablerow }: any) {
	const [data, setData] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)
	const [inputStatus, setInputStatus] = useState<InputStatusState>({})

	const { updateRow } = useUpdateRow()

	useEffect(() => {
		fetch(apiUrl + '/api/translation.php?tablerow=' + tablerow)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.json()
			})
			.then((data) => {
				if (Array.isArray(data)) {
					setData(data)
				} else {
					throw new Error('Data is not in the expected format')
				}
				setLoading(false)
			})

			.catch((error) => {
				setError(error)
				setLoading(false)
			})
	}, [tablerow])

	const handleInputChange = (
		id: any,
		lang: string,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newValue = event.target.value

		// Update the local state
		setData((prevData) => {
			return prevData.map((row) => {
				if (row.id === id) {
					return {
						...row,
						[lang]: newValue,
					}
				}
				return row
			})
		})

		setInputStatus((prevStatus) => ({
			...prevStatus,
			[`${id}-${lang}`]: 'changed',
		}))

		updateRow(id, lang, newValue).then((responseData) => {
			console.log('Response Data:', responseData)

			// Check if the response data contains the success message
			if (
				responseData &&
				responseData.message === 'Data updated successfully'
			) {
				setInputStatus((prevStatus) => ({
					...prevStatus,
					[`${id}-${lang}`]: 'success',
				}))
			} else {
				// Handle any other cases as an error
				setInputStatus((prevStatus) => ({
					...prevStatus,
					[`${id}-${lang}`]: 'error',
				}))
			}
		})
	}

	const getStatusClass = (id: any, lang: string) => {
		const statusKey = `${id}-${lang}`
		const status = inputStatus[statusKey]
		switch (status) {
			case 'changed':
				return 'input-warning'
			case 'success':
				return 'input-success'
			case 'error':
				return 'input-error'
			default:
				return ''
		}
	}

	const headers = data.length > 0 ? Object.keys(data[0]) : []

	return (
		<div className='overflow-x-auto'>
			<h2 className='text-3xl font-bold ml-4 mt-10'>{tablerow}</h2>

			{loading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			<table className='table'>
				<thead>
					<tr>
						{headers
							.filter((header) => {
								if (header === 'id' || header === 'tablerow') return false
								if (header === 'wash' && tablerow !== 'Materialzusammensetzung')
									return false
								return true
							})
							.map((header) => (
								<th key={header}>{header}</th>
							))}
					</tr>
				</thead>
				<tbody>
					{data.map((row) => (
						<tr key={row.id}>
							{headers
								.filter((header) => {
									if (header === 'id' || header === 'tablerow') return false
									if (
										header === 'wash' &&
										tablerow !== 'Materialzusammensetzung'
									)
										return false
									return true
								})
								.map((header) => (
									<td key={header}>
										{header === 'val' ? (
											row[header]
										) : (
											<input
												type='text'
												value={row[header] || ''}
												placeholder={row[header]}
												className={`input input-bordered w-full max-w-xs ${
													header === 'wash' ? 'waesche-font' : ''
												} ${getStatusClass(row.id, header)}`}
												onChange={(e) => handleInputChange(row.id, header, e)}
											/>
										)}
									</td>
								))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default TableRow
