require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');

const productRoutes = require('./routes/productRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());

// ROUTES
app.use('/products', productRoutes);
app.use('/calculator', calculatorRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

module.exports = app;