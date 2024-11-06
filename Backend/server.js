
const { error, table } = require("console");
const mysql = require("mysql2");
const http = require('http')
const {URL} = require('url')


// Importing operations for sailors, boats, and reserves
const sailorsop = require('./lib/sailors.js')
const boatsop = require('./lib/boats.js')
const resrvesop = require('./lib/reserves.js')

// Creating a MySQL database connection
const  db = mysql.createConnection({
  host: 'boatapp.c7use4wo6tbg.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Mysql571?',
  connectTimeout: 30000
});

// Connecting to the MySQL database
db.connect((err) =>{
  if(err) throw err;
  console.log('connected...');
})

// Creating the 'sailingadventure' database if it doesn't exist
const sql = "CREATE DATABASE IF NOT EXISTS sailingadventure";

db.query(sql, (err) => {
  if (err) throw err;
  console.log(`Database sailingadventure created or already exists`);
});

// Creating 'Sailors' table
const sailors = `CREATE TABLE IF NOT EXISTS sailingadventure.Sailors (
    S_ID int AUTO_INCREMENT,
    S_name varchar(100) NOT NULL,
    B_date DATE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (S_ID)
);`;

db.query(sailors, (err) => {
  if (err) throw err;
  console.log(`Table sailors created`);
});

// Creating 'Boats' table
const boats = `
CREATE TABLE IF NOT EXISTS sailingadventure.Boats (
    B_ID int AUTO_INCREMENT,
    B_Name varchar(100) NOT NULL,
    B_type varchar(250),
    PRIMARY KEY (B_ID)
)`;

db.query(boats, (err) => {
  if (err) throw err;
  console.log(`Table boats created`);
});

// Creating 'Reserves' table
const reserves = `
CREATE TABLE IF NOT EXISTS sailingadventure.Reserves (
    S_ID int,
    B_ID int,
    date DATE,
    time TIME,
    PRIMARY KEY (S_ID, B_ID),
    FOREIGN KEY (S_ID) REFERENCES Sailors(S_ID),
    FOREIGN KEY (B_ID) REFERENCES Boats(B_ID)
)`;

db.query(reserves, (err) => {
  if (err) throw err;
  console.log(`Table reserves created`);
});

// Handling HTTP requests
const requestHandler = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

  // Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
      res.writeHead(204); // No Content
      res.end();
      return;
  }
    const baseURL = "http://" + req.headers.host + "/"
    const {pathname, searchParams} = new URL(req.url, baseURL);
    let entries = searchParams.entries();
    let query = Object.fromEntries(entries);
    let method = req.method.toUpperCase();
  
    // Routing based on HTTP method and path
    switch(method){
      case 'POST': 
          if (pathname === '/sailors' || pathname === '/sailors/'){
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });

            // Process the collected data once the request ends
            req.on('end', () => {
              try {
                const data = JSON.parse(body);  
                sailorsop.add(db, data, (response) => {
                  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                  res.writeHead(200);
                  res.end('Data added successfully');
              });
              } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
          });
  
          } else if(pathname === '/signin' || pathname === '/signin/'){
            let body = '';
            req.on('data', (chunk) => {
            body += chunk.toString();
            });
            req.on('end', () => {
              try{
                const { email, password } = JSON.parse(body);

                // Query the database for the user with the given email
                const query = 'SELECT * FROM sailingadventure.Sailors WHERE email = ? and password = ?';
                db.query(query, [email,password], (err, results) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Internal Server Error' }));
                    }

                    if (results.length === 0) {
                        // No user found with this email
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Invalid email or password' }));
                    }else{
                      const sailorId = results[0].S_ID;
                      res.writeHead(200, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({  token: 'sample-token', S_ID: sailorId }))
                    }

                });

              }catch (error) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Invalid JSON' }));
                }

            });

          } else if (pathname === '/boats' || pathname === '/boats/'){
            boatsop.add(db, query, (response)=>{
                res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
                res.writeHeader(200);
                res.end(response);   
            })

          }
          else if (pathname === '/reserves' || pathname === '/reserves/'){
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                  const data = JSON.parse(body);
                  resrvesop.add(db, data, (response) => {
                    res.setHeader('Content-Type', 'application/json; charset="utf-8"');
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: response }));
                  });
              
                }catch (err) {
                  res.writeHead(400, { 'Content-Type': 'application/json; charset="utf-8"' });
                  res.end(JSON.stringify({ error: 'Invalid JSON format' }));
              }
          })
            

        }
        break;

      case 'GET': 
          if (pathname === '/sailors' || pathname === '/sailors/'){
            res.setHeader('Content-Type', 'text/plain, charset = "utf-8"')
            res.writeHeader(200);
            sailorsop.display(db,(results)=>{
              results.forEach(row => {
                const rowData = Object.values(row).join(' '); 
                res.write(rowData + '\n'); 
            });
            res.end();
            });

          }else if (pathname === '/boats' || pathname === '/boats/'){
            res.setHeader('Content-Type', 'text/plain, charset = "utf-8"')
            res.writeHeader(200);
            boatsop.display(db,(results)=>{
              results.forEach(row => {
                const rowData = Object.values(row).join(' '); 
                res.write(rowData + '\n'); 
            });
            res.end();
            });
          }else if (pathname === '/reserves' || pathname === '/reserves/'){
            res.setHeader('Content-Type', 'text/plain, charset = "utf-8"')
            res.writeHeader(200);
            resrvesop.display(db,(results)=>{
              results.forEach(row => {
                const rowData = Object.values(row).join(' '); 
                res.write(rowData + '\n'); 
            });
            res.end();
            });
          }else{
            res.setHeader('Content-Type', 'text/plain, charset = "utf-8"')
            res.writeHeader(400);
            res.end("Invalid response");
          }
        break
      case 'DELETE': 
          if (pathname === '/sailors' || pathname === '/sailors/'){
            sailorsop.delete(db, query,(response)=>{
                  res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
                  res.writeHeader(200);
                  res.end(response);
              })
          } 
          else if (pathname === '/boats' || pathname === '/boats/'){
            boatsop.delete(db,query,(response)=>{
              res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
              res.writeHeader(statuscode);
              res.end(response);
          })
          }else if (pathname === '/reserves' || pathname === '/reserves/'){
            resrvesop.delete(db,query,(response)=>{
              res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
              res.writeHeader(200);
              res.end(response);
            })
          }else{
              res.setHeader('Content-Type', 'text/plain, charset = "utf-8"')
              res.writeHeader(400);
              res.end("Invalid response");
          }
        break
      case 'PUT': 
          if (pathname === '/sailors' || pathname === '/sailors/'){
              sailorsop.update(db,query,(response)=>{
                  res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
                  res.writeHeader(200);
                  res.end(response);
              })
          } 
          else if (pathname === '/boats' || pathname === '/boats/'){
            boatsop.update(db,query,(response)=>{
              res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
              res.writeHeader(200);
              res.end(response);
          })
          }else if (pathname === '/reserves' || pathname === '/reserves/'){
            resrvesop.update(db,query,(response)=>{
              res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
              res.writeHeader(200);
              res.end(response);
            })
          }else{
              res.setHeader('Content-Type', 'text/plain, charset = "utf-8"')
              res.writeHeader(400);
              res.end("Invalid response");
          }
        break
    };
};

// Creating an HTTP server and specifying request handler
const server = http.createServer(requestHandler)


// Handling server close event to close database connection
server.on('close', () => {
  console.log('Server is closing. Closing database connection...');
  
  // Close the MySQL connection
  db.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('Database connection closed successfully.');
    }
  });
});

// Starting the server to listen on port 3000
server.listen(3000, () => {
    console.log('Listening')
});

