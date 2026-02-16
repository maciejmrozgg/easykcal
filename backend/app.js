require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');

const productRoutes = require('./routes/productRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());

// ROUTES
app.use('/products', productRoutes);
app.use('/calculator', calculatorRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

module.exports = app;