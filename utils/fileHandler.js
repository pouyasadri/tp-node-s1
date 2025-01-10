const fs = require('fs');
const path = require('path');

const studentsFile = path.join(__dirname, '../Data', 'students.json');

function readStudentsFile(callback) {
    fs.readFile(studentsFile, 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading students file: ${studentsFile}`, err);
            return callback(null, []);
        }
        try {
            const students = JSON.parse(data);
            callback(null, students);
        } catch (error) {
            console.log(`Error parsing students file: ${studentsFile}`, error);
            callback(error, []);
        }
    });
}

function writeStudentsFile(students, callback) {
    fs.writeFile(studentsFile, JSON.stringify(students, null, 2), (err) => {
        if (err) {
            console.log(`Error saving students to file: ${studentsFile}`, err);
            return callback(err);
        }
        callback(null);
    });
}

module.exports = { readStudentsFile, writeStudentsFile };
