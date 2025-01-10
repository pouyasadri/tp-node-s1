const { v4: uuidv4 } = require('uuid');
const { readStudentsFile, writeStudentsFile } = require('./fileHandler');

function addStudent(name, birth, callback) {
    readStudentsFile((err, students) => {
        if (err) {
            return callback(err);
        }
        const newStudent = {
            id: uuidv4(),
            name,
            birth,
        };
        students.push(newStudent);
        writeStudentsFile(students, callback);
    });
}

function deleteStudentById(id, callback) {
    readStudentsFile((err, students) => {
        if (err) {
            return callback(err, false);
        }
        const updatedStudents = students.filter(student => student.id !== id);

        if (students.length === updatedStudents.length) {
            return callback(null, false);
        }

        writeStudentsFile(updatedStudents, (writeErr) => {
            if (writeErr) {
                return callback(writeErr, false);
            }
            callback(null, true);
        });
    });
}

module.exports = { addStudent, deleteStudentById };
