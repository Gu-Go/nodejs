const http = require('http');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql');

// Replace the database credentials with your own
const dbConfig = {
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit') {
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

        const insertQuery = 'INSERT INTO form_data (field1, field2, field3) VALUES (?, ?, ?)';
        // Replace 'form_data' and 'field1', 'field2', 'field3' with your table and column names.

        connection.query(insertQuery, [formData.field1, formData.field2, formData.field3], (err, result) => {
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
    // Serve the HTML form if the request is a GET or not to the /submit path
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <form action="/submit" method="post">
        <input type="text" name="field1" placeholder="Field 1" required><br>
        <input type="text" name="field2" placeholder="Field 2" required><br>
        <input type="text" name="field3" placeholder="Field 3" required><br>
        <button type="submit">Submit</button>
      </form>
    `);
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
