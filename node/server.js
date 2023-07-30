// Creating your own Web server with nodejs and conencting to mySQL database
// use this template for your Project Phase 2

var http = require('http');     
var fs = require('fs');         
var url = require('url');       
var path = require('path');  
const qs = require('querystring');   
var mysql = require("mysql");
var fileExtensions = {
     ".html":    "text/html",
     ".css":     "text/css",
     ".js":      "text/javascript",
     ".jpeg":    "image/jpeg",
     ".jpg":     "image/jpeg",
     ".png":     "image/png"
 };

//replace the below parameters with your own

var con = mysql.createConnection({
    host: "localhost",
    user: "elva",
    password: "CIS3456^",
    database: "CIS425"
});
con.connect();

var server = http.createServer(function(req, res) { 

//console.log(request.url);
//console.log(request.headers.host);
var base = "http://" + req.headers.host;
//console.log(base);
var completeurl = new URL(req.url, base);
//console.log(completeurl);
//console.log(completeurl.href);

var table = completeurl.searchParams.get("tableName");
//console.log(table);
// if (table=="products") {
if (req.url === '/') {
    fs.readFile("index.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(html);
    });
} else if (table =='products') {
    var myQuery = "SELECT * from products";
    // var myQuery = "SELECT * from feedback";
    con.query(myQuery, function(err, result, fields){
        console.log(result);
        res.end(JSON.stringify(result));
    });

} else if (req.method === 'GET') {
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
    //   const connection = mysql.createConnection(dbConfig);

    //   connection.connect((err) => {
        // con.connect((err) => {
        // if (err) {
        //   console.error('Error connecting to database:', err);
        //   return;
        // }

        const insertQuery = 'INSERT INTO feedback (first_name, last_name, email, message) VALUES (?, ?, ?, ?)';
        // Replace 'form_data' and 'field1', 'field2', 'field3' with your table and column names.

        // connection.query(insertQuery, [formData.first_name, formData.last_name, formData.email, formData.message], (err, result) => {
        con.query(insertQuery, [formData.first_name, formData.last_name, formData.email, formData.message], (err, result) => {
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

        // connection.end();
        // con.end();
      });
    // };

} else {
    var pathname = url.parse(req.url).pathname;
    var filename;
    if(pathname === "/") {
        // change the 'filename' to the homepage of your website (if other than "index.html") 
        filename = "index.html"; 
    }
    else
        filename = path.join(process.cwd(), pathname);

    try {
        fs.accessSync(filename, fs.F_OK);
        var fileStream = fs.createReadStream(filename);
        var typeAttribute = fileExtensions[path.extname(filename)];
        res.writeHead(200, {'Content-Type': typeAttribute});
        fileStream.pipe(res);
    }
    catch(e) {
            console.log("\n\n");
            console.log('File does not exist: ' + filename);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 - File Not Found (' + filename + ')');
            res.end();
    }
} // end for else

con.end();
}); // var server = http.createServer


server.listen(8000);
console.log("\nThe Web server is alive!!!\n"  + 
    "It's listening on http://127.0.0.1:8000 or http://localhost:8000");