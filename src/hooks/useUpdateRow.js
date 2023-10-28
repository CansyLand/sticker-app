import { useState } from 'react';
const homepageUrl = process.env.REACT_APP_HOMEPAGE_URL;

function useUpdateRow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRow = async (id, lang, val) => {
    setLoading(true);
    try {
      const response = await fetch(homepageUrl + `/api/update.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, lang, val }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle the response as needed
      const data = await response.json();
      setLoading(false);
      console.log(data);
      return data;
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { updateRow, loading, error };
}

export default useUpdateRow;
