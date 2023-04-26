const express		= require('express');
const bodyParser	= require('body-parser');
const cookieParser 	= require('cookie-parser');
const mongoose 		= require('mongoose');
const dotenv 		= require('dotenv');
const cors 			= require('cors');

const homeRoute		 = require('./routes/home');
const authRoutes	 = require('./routes/authRoutes');
const updateRoutes	 = require('./routes/updateRoutes');
const locationRoutes = require('./routes/locationRoutes');
const bookingRoutes  =  require('./routes/bookingRoutes');
const userRoutes 	 = require('./routes/userRoutes');
const lockCleaner = require('./services/bookingLockCleaner');

dotenv.config();

/* DATABASE CONNECTION */
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL, {
 	useNewUrlParser: true,
	useUnifiedTopology: true
	},
	(err) => {
		if(err)
			console.log("Error connecting to database");
		else
			console.log("Connected to database");
	}
);

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ['content-type', 'Authorization', 'Content-Type'],
    origin: ['http://localhost:3000', 'http://localhost:4000']
	// allow all origins

}));


app.use('/', homeRoute);
app.use('/public', express.static('public'));
app.use('/api/auth/', authRoutes);
app.use('/api/update/', updateRoutes);
app.use('/api/location/', locationRoutes);
app.use('/api/book/', bookingRoutes);
app.use('/api/user/', userRoutes);

app.listen(process.env.PORT, () => {
	console.log("Server started on port " + process.env.PORT + ".");
});


// setInterval(lockCleaner, 5 * 1000);