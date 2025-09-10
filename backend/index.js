const fs = require('fs');
const https = require('https');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

const key = fs.readFileSync(process.env.KEY_PATH);
const cert = fs.readFileSync(process.env.CERT_PATH);

https.createServer({ key, cert }, app).listen(PORT, HOST, () => {
  console.log(`✅ Server running at https://${HOST}:${PORT}`);
});