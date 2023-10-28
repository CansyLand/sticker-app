const homepageUrl = process.env.REACT_APP_HOMEPAGE_URL;

// Function to handle SQLite database operations
function checkAndUpdateDatabase(jsonData, callback) {
    // Function to add a missing value to the SQLite database
    const createRowInDatabase = async (tablerow, val) => {
        try {
            const response = await fetch(homepageUrl + '/api/add-row.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tablerow, val })
            });

            if (!response.ok) {
                throw new Error('Failed to add row to the database');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch the entire SQLite database
    const fetchDatabase = async () => {
        const response = await fetch(homepageUrl + '/api/fetch-database.php');
        const databaseData = await response.json();
       
        // These are the columns we are interested in the jsonData
        const columns = [
            'warengruppe',
            'qualitaet1_hinweis',
            'ursprungsland',
            'farb_bezeichnung'
        ];

        // The SQLite database table is a little bit different structured
        // rows are: 
        // id,  tablerow,       val,        de,     en,     ru …
        // 1,   warengruppe,    Kleider,    Kleid   Dress   …
        // 2,   ursprungsland,  China REp   China

        // Set to track tablerow and val combinations that have been processed
        const processedValues = new Set();

        // Iterate over jsonData and check against databaseData
        for (const entry of jsonData) {
            for (const row of columns) {
                const valueInJsonData = entry[row];

                // Create a unique key for tablerow and val combination
                const uniqueKey = `${row}-${valueInJsonData}`;

                // Check if this value is present in the database or has been processed already
                const existsInDatabase = databaseData.some(
                    (dbEntry) => dbEntry.tablerow === row && dbEntry.val === valueInJsonData
                ) || processedValues.has(uniqueKey);

                if (!existsInDatabase) {
                    // This value is missing in the database
                    console.log(`Missing in database: ${row} - ${valueInJsonData}`);
                    // Adding missing value to the database
                    const newRow = await createRowInDatabase(row, valueInJsonData);
                    // Push the new row into the databaseData array
                    databaseData.push(newRow);
                    // Mark this combination as processed
                    processedValues.add(uniqueKey);
                }
            }
        }

        // Return the updated database data using a callback
        callback(databaseData);
    }

    fetchDatabase();
}

export default checkAndUpdateDatabase;
