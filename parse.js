const { google } = require('googleapis');
const { createObjectCsvWriter } = require('csv-writer');
const credentials = require('./public/votes.csv');

const spreadsheetId = '930494811'; // Replace with your actual spreadsheet ID
const range = 'Sheet1!D4:E10'; // Update the range according to your sheet

async function fetchSheetData() {
    const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values;
}

async function writeToCsv(data) {
    const csvWriter = createObjectCsvWriter({
        path: 'votes.csv', // Output CSV file path
        header: [
            { id: 'state', title: 'State' },
            { id: 'votes', title: 'Votes' },
        ],
        append: true, // Set to true if you want to append data to an existing file
    });

    const records = data.map(row => ({ state: row[0], votes: row[1] }));
    await csvWriter.writeRecords(records);
    console.log('CSV file has been updated.');
}

(async () => {
    try {
        const data = await fetchSheetData();
        await writeToCsv(data);
    } catch (error) {
        console.error('Error updating CSV:', error);
    }
})();
