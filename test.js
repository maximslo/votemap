const fs = require('fs');
const csv = require('csv-parser');
const { format } = require('fast-csv');

const inputFile = '../site/votes.csv'; // Replace with your CSV file path
const stateToUpdate = 'Massachusetts'; // Replace with the state you want to update
const incrementValue = 1; // The value by which you want to increment the votes

let data = [];

// Read the CSV file and process each row
fs.createReadStream(inputFile)
  .pipe(csv())
  .on('data', (row) => {
    if (row.state === stateToUpdate) {
      // Increment the votes for the specified state
      row.votes = parseInt(row.votes, 10) + incrementValue;
    }
    data.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');

    // Overwrite the original file with updated data
    const ws = fs.createWriteStream(inputFile);
    ws.on('finish', () => console.log('CSV file has been updated'));

    const csvStream = format({ headers: true });
    csvStream.pipe(ws);

    data.forEach(row => csvStream.write(row));
    csvStream.end();
  });
