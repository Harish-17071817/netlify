const fs = require('fs');
const path = require('path');

// Netlify function handler
exports.handler = async function(event, context) {
    const filePath = path.resolve(__dirname, '../data/lot.txt');  // Adjust the path to the data file

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let lotNames = data.split(',').map(lot => lot.trim()).filter(Boolean);  // Read lot names

        if (lotNames.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ lotName: null }),  // No lot names available
            };
        }

        // Generate a random lot name
        const randomIndex = Math.floor(Math.random() * lotNames.length);
        const randomLotName = lotNames[randomIndex];

        // Remove the selected lot name from the array
        lotNames.splice(randomIndex, 1);

        // Write the updated lot names back to the file
        fs.writeFileSync(filePath, lotNames.join(','), 'utf8');

        // Return the selected lot name
        return {
            statusCode: 200,
            body: JSON.stringify({ lotName: randomLotName }),  // Send lot name as JSON
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'An error occurred' }),  // Handle errors
        };
    }
};
