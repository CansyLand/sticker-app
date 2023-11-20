// Function to translate a value based on a translation table and languages
export function translate(translationTable, val, languages) {
    if (!Array.isArray(languages)) {
        languages = [languages];
    }

    const entry = translationTable.find(item => item.val === val);
    if (!entry) {
        return val;
    }

    return languages.map(lang => entry[lang] || val).join(' / ');
}

// Function to convert Excel date format to JavaScript date
export function excelDateToJSDate(serial) {
    const epoch = new Date(1900, 0, 1);
    if (serial >= 60) {
        serial--;  // Adjusting for Excel's leap year bug in 1900
    }
    const date = new Date(epoch.getTime() + (serial - 1) * 24 * 60 * 60 * 1000);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${month}.${date.getFullYear()}`;
}
