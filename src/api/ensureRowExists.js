const ensureRowExists = async (tablerow, val) => {
    // Call the server API to check if the row exists
    const response = await fetch(`http://localhost:8888/check-row?tablerow=${tablerow}&val=${val}`);
    const data = await response.json();

    // If the row exists, return it
    if (data.exists) {
        return data.row;
    } else {
        // If the row does not exist, create it
        const createResponse = await fetch('http://localhost:8888/create-row', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tablerow, val })
        });
        const createdRow = await createResponse.json();
        return createdRow;
    }
};

export default ensureRowExists;
