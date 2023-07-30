const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');

// Replace the database credentials with your own
const dbConfig = {
    host: "localhost",
    user: "elva",
    password: "CIS3456^",
    database: "CIS425"
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    // Serve the HTML form if the request is a GET
    fs.readFile('contact.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.method === 'POST') {
    // Handle form submission if the request is a POST
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const formData = qs.parse(body);

      // Make sure you have the 'mysql' package installed: npm install mysql
      const connection = mysql.createConnection(dbConfig);

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return;
        }

        const insertQuery = 'INSERT INTO feedback (first_name, last_name, email, message) VALUES (?, ?, ?, ?)';
        // Replace 'form_data' and 'field1', 'field2', 'field3' with your table and column names.

        connection.query(insertQuery, [formData.first_name, formData.last_name, formData.email, formData.message], (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('An error occurred while processing the form data.');
            return;
          }

          console.log('Form data inserted:', result);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1>Form data submitted successfully!</h1>');
        });

        connection.end();
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// const port = 8000;
// server.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

server.listen(8000);
console.log("\nThe Web server is alive!!!\n"  + 
    "It's listening on http://127.0.0.1:8000 or http://localhost:8000");