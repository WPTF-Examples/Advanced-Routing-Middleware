const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.locals.title = 'My App'; // set the "title" property (accessible in our templates)

// cookie parsing middleware (3rd party middleware)

app.use(cookieParser());

// Application Level Middleware

app.use((req, res, next) => {
  console.log(`Request from: ${req.get('user-agent')} [${new Date()}]`);
  next();
});

// Custom 'Random Deny' Middleware

function randomDeny(req, res, next) {
  let allowed = Math.floor(Math.random() * 2); // 0 or 1

  if (allowed) {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
}

// welcome route "/"

app.get('/', (req, res) => {
  res.send('Hello World - please check the server.js code for which routes to test');
});

// Match All HTTP Verbs

app.all('/http-testing', (req, res) => {
  res.send('test complete');
});

// HTTP Verb Methods

app.get('/get-test', (req, res) => {
  res.send('GET Test Complete');
});

app.put('/put-test', (req, res) => {
  res.send('PUT Test Complete');
});

app.post('/post-test', (req, res) => {
  res.send('POST Test Complete');
});

app.delete('/delete-test', (req, res) => {
  res.send('DELETE Test Complete');
});

// Route parameters

app.get('/employee/:employeeNum', (req, res) => {
  res.send(`Employee Number: ${req.params.employeeNum}`);
});

// Query Parameters

app.get('/products', (req, res) => {
  let result = 'all Products';

  // NOTE: query parameter values are always strings

  if (req.query.onSale == 'true') {
    result += ' (on sale)';
  }

  res.send(result);
});

// Get a specific Header

app.get('/hello', (req, res) => {
  res.send(`Hello ${req.get('user-agent')}`);
});

// Send a Cookie

app.get('/cookie-test', (req, res) => {
  res.cookie('message', 'Hello World!');
  res.send('Cookie Sent!');
});

// Read the cookie (using the cookie-parsing middleware)

app.get('/read-cookies', (req, res) => {
  res.send(req.cookies);
});

// Redirect the client

app.get('/to-google', (req, res) => {
  res.redirect('https://www.google.ca/');
});

// Status / res.end() - set status without sending any content

app.get("/status-test", (req,res)=>{
  res.status(418).end();
});

// Custom Middleware (randomDeny) test

app.get('/secure', randomDeny, (req, res) => {
  res.send('Welcome!');
});

// Trigger an error for the error handling middleware

app.get('/error-test', (req, res) => {
  throw new Error('Error Test');
});

// Trigger for a 404 error (ie: redirect to unknown route)

app.get("/unknown", (req,res)=>{
  res.redirect("/abcdefghijk");
});

// Error handling middleware

app.use((err, req, res, next) => {
  res.status(500).send(`500 - ${err.message}`);
});

app.use((req, res, next) => {
  res.status(404).send("404 - We're unable to find what you're looking for.");
});



app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));