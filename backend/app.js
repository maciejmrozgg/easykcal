require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// ROUTES
app.use('/products', productRoutes);
app.use('/calculator', calculatorRoutes);
app.use(errorHandler);

module.exports = app;