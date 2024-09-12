// Million Aboye
// Assignment 3
// 4/22/2024
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
  host: 'it207.c3s66syqix6x.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'IT207sql'
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
    Rate INT,
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
    const baseURL = "http://" + req.headers.host + "/"
    const {pathname, searchParams} = new URL(req.url, baseURL);
    let entries = searchParams.entries();
    let query = Object.fromEntries(entries);
    let method = req.method.toUpperCase();
  
    // Routing based on HTTP method and path
    switch(method){
      case 'POST': 
          if (pathname === '/sailors' || pathname === '/sailors/'){
              sailorsop.add(db, query, (response)=>{
                  res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
                  res.writeHeader(200);
                  res.end(response);   
              })
  
          } 
          else if (pathname === '/boats' || pathname === '/boats/'){
            boatsop.add(db, query, (response)=>{
                res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
                res.writeHeader(200);
                res.end(response);   
            })

        }
          else if (pathname === '/reserves' || pathname === '/reserves/'){
            resrvesop.add(db, query, (response)=>{
                res.setHeader('Content-Type', 'text/plain; charset = "utf-8"')
                res.writeHeader(200);
                res.end(response);   
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
              res              .writeHeader(200);
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

