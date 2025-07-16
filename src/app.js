const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: ['http://192.168.1.1:3000', 'https://indian-tourism.vercel.app', 'http://localhost:3000'],
    credentials: true,
}));

const homeRoute = require('@routes/home');
const authRoute = require('@routes/authRoutes');
const tokenRoute = require('@routes/tokenRoutes');
const updateRoute = require('@routes/updateRoutes');
const locationRoute = require('@routes/locationRoutes');
const bookingRoute = require('@routes/bookingRoutes');
const userRoute = require('@routes/userRoutes');
const scannerRoute = require('@routes/scannerRoutes');

app.use('/', homeRoute);
app.use('/public', express.static('public'));
app.use('/api/token', tokenRoute);
app.use('/api/auth/', authRoute);
app.use('/api/update/', updateRoute);
app.use('/api/location/', locationRoute);
app.use('/api/book/', bookingRoute);
app.use('/api/user/', userRoute);
app.use('/scanner', scannerRoute);

module.exports = app;
