const fs = require('fs');
const https = require('https');
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

const key = fs.readFileSync(process.env.KEY_PATH);
const cert = fs.readFileSync(process.env.CERT_PATH);

const server = https.createServer({ key, cert }, app);

// Prevent multiple shutdown attempts
let isShuttingDown = false;

async function gracefulShutdown(signal) {
  console.log(`${signal}`);

  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  // Wait for the server to close before closing the database pool
  server.close(async (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Server closed");

    try {
      // Close PostgreSQL connections
      await pool.end();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}

// Handle Ctrl+C in the terminal
process.on("SIGINT", () => {
  gracefulShutdown("SIGINT");
});

// Handle termination signal (e.g. from the operating system or deployment platform)
process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM");
});

server.listen(PORT, HOST, () => {
  console.log(`✅ Server running at https://${HOST}:${PORT}`);
});