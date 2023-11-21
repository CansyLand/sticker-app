import { useState } from 'react'
const homepageUrl = process.env.REACT_APP_API_ENDPOINT

function useUpdateRow() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const updateRow = async (id: any, lang: any, val: any) => {
		setLoading(true)
		try {
			const response = await fetch(homepageUrl + `/api/update.php`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, lang, val }),
			})

			if (!response.ok) {
				throw new Error('Network response was not ok')
			}

			// Handle the response as needed
			const data = await response.json()
			setLoading(false)
			console.log(data)
			return data
		} catch (err) {
			if (err instanceof Error) {
				setError(err)
			} else {
				// Handle the case where it's not an Error object
				setError(new Error('An unknown error occurred'))
			}
			setLoading(false)
		}
	}

	return { updateRow, loading, error }
}

export default useUpdateRow
