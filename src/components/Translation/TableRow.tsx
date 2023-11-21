import React, { useState, useEffect } from 'react'
import useUpdateRow from 'hooks/useUpdateRow'

const apiUrl = process.env.REACT_APP_API_ENDPOINT

function TableRow({ tablerow }: any) {
	const [data, setData] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

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

	const { updateRow } = useUpdateRow()

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

		updateRow(id, lang, newValue)
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
								if (header === 'wash' && tablerow !== 'qualitaet1_hinweis')
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
									if (header === 'wash' && tablerow !== 'qualitaet1_hinweis')
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
												}`}
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
