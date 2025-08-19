require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');

const productRoutes = require('./routes/productRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const errorHandler = require('./middleware/errorHandler');
// w przyszłości dodamy: const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

const key = fs.readFileSync(process.env.KEY_PATH);
const cert = fs.readFileSync(process.env.CERT_PATH);

const corsOptions = require('./config/corsOptions');
app.use(cors(corsOptions));

app.use(express.json());

// ROUTES
app.use('/products', productRoutes);
app.use('/calculator', calculatorRoutes);
// app.use('/auth', authRoutes);   (dodamy później)
app.use(errorHandler);

https.createServer({ key, cert }, app).listen(PORT, HOST, () => {
  console.log(`✅ Server running at https://${HOST}:${PORT}`);
});