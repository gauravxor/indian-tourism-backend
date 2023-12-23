const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const color = require('colors'); // eslint-disable-line no-unused-vars

const homeRoute = require('./routes/home');
const authRoutes = require('./routes/authRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const updateRoutes = require('./routes/updateRoutes');
const locationRoutes = require('./routes/locationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const scannerRoutes = require('./routes/scannerRoutes');

const otpCleaner = require('./services/otpCleaner');
const lockCleaner = require('./services/bookingLockCleaner');

/* DATABASE CONNECTION */
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) console.log('SERVER : Error connecting to database');
    else console.log('SERVER : Connected to database'.yellow);
});

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ['content-type', 'Authorization', 'Content-Type'],
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://192.168.0.100:3000'],
}));

app.use('/', homeRoute);
app.use('/public', express.static('public'));
app.use('/api/token', tokenRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/update/', updateRoutes);
app.use('/api/location/', locationRoutes);
app.use('/api/book/', bookingRoutes);
app.use('/api/user/', userRoutes);
app.use('/scanner', scannerRoutes);

app.listen(process.env.PORT, () => {
    console.log('SERVER : Service started on port '.yellow + `${process.env.PORT}.`.cyan);
});

/** Invoke bookingLockCleaner in every 5 seconds */
setInterval(lockCleaner, 5 * 1000);

/** Invoke OtpCleaner in every 15 seconds */
setInterval(otpCleaner, 15 * 1000);
