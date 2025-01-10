require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const {parse} = require('querystring');
const {readStudentsFile} = require('./utils/fileHandler');
const {addStudent, deleteStudentById} = require('./utils/studentManager');
const {formatDate} = require('./utils/format');

const PORT = process.env.APP_PORT || 8080;
const HOST = process.env.APP_LOCALHOST || 'localhost';

http.createServer((req, res) => {
    const url = req.url.split('?')[0];

    if (req.url.startsWith('/css/')) {
        const cssPath = path.join(__dirname, 'assets', req.url);
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('CSS file not found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.end(data);
            }
        });
        return;
    }

    if (url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const formHTML = pug.renderFile('./views/home.pug', {title: 'Add Student'});
        res.end(formHTML);
    } else if (url === '/users') {
        readStudentsFile((err, students) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('<h1>Internal Server Error</h1>');
                return;
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            const usersHTML = pug.renderFile('./views/users.pug', {
                title: 'Students List',
                students,
                formatDate,
            });
            res.end(usersHTML);
        });
    } else if (url === '/add' && req.method === 'POST') {
        let body = '';
        req.on('data', data => {
            body += data.toString();
        });
        req.on('end', () => {
            const {name, birth} = parse(body);

            if (!name || name.length < 3 || !birth || isNaN(Date.parse(birth))) {
                res.writeHead(400, {'Content-Type': 'text/html'});
                res.end('<h1>Invalid input. Please try again.</h1><a href="/">Go Back</a>');
                return;
            }

            addStudent(name, birth, (err) => {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/html'});
                    res.end('<h1>Failed to add student. Please try again.</h1><a href="/">Go Back</a>');
                    return;
                }

                res.writeHead(302, {Location: '/users'});
                res.end();
            });
        });
    } else if (url.startsWith('/delete')) {
        const query = parse(req.url.split('?')[1]);
        const {id} = query;

        if (!id) {
            res.writeHead(400, {'Content-Type': 'text/html'});
            res.end('<h1>Invalid ID. Please try again.</h1><a href="/users">Go Back</a>');
            return;
        }

        deleteStudentById(id, (err, success) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end('<h1>Failed to delete student. Please try again.</h1><a href="/users">Go Back</a>');
                return;
            }

            if (!success) {
                res.writeHead(400, {'Content-Type': 'text/html'});
                res.end('<h1>Student not found. Please try again.</h1><a href="/users">Go Back</a>');
                return;
            }

            res.writeHead(302, {Location: '/users'});
            res.end();
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>404 - Page Not Found</h1>');
    }
}).listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
