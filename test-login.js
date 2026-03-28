const http = require('http');

const data = JSON.stringify({ email: "test@example.com", password: "wrongpassword" });

const req = http.request({
  hostname: 'localhost',
  port: 8000,
  path: '/api/v1/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Origin': 'http://localhost:5173'
  }
}, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.on('data', chunk => {
    console.log(`BODY: ${chunk.toString()}`);
  });
});

req.on('error', e => {
  console.error(`PROBLEM: ${e.message}`);
});

req.write(data);
req.end();
