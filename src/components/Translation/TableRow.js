import React, { useState, useEffect } from 'react';
import useUpdateRow from '../../hooks/useUpdateRow';

function TableRow({ tablerow }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  useEffect(() => {
    fetch('http://localhost:8888/api/translation.php?tablerow=' + tablerow)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setData(data);
        } else {
          throw new Error('Data is not in the expected format');
        }
        setLoading(false);
      })
      
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);


  const { updateRow } = useUpdateRow(); // Use the custom hook

  const handleInputChange = (id, lang, event) => {
    const newValue = event.target.value;
    
    // Update the local state
    setData(prevData => {
        return prevData.map(row => {
            if (row.id === id) {
                return {
                    ...row,
                    [lang]: newValue
                };
            }
            return row;
        });
    });

    updateRow(id, lang, newValue);
  };


  const headers = data.length > 0 ? Object.keys(data[0]) : [];


  return (
    <div className="overflow-x-auto">
        <h2 className="text-3xl font-bold ml-4 mt-10">{tablerow}</h2>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <table className="table">
            <thead>
                <tr>
                    {headers.filter(header => header !== 'id' && header !== 'tablerow').map(header => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id}>
                  {headers.filter(header => header !== 'id' && header !== 'tablerow').map(header => (
                    <td key={header}>
                      {header === 'val' ? (
                        row[header]
                      ) : (
                        <input 
                          type="text"
                          value={row[header] || ''}
                          placeholder={row[header]} 
                          className="input input-bordered w-full max-w-xs"
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
  );
  
}

export default TableRow;
