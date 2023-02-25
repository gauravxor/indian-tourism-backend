const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// user defined routes
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/authRoutes');
const updateRoutes = require('./routes/updateRoutes');



// database connection
const dataBase = "mongodb+srv://tour-admin:abcdefgh@indian-tourism.syt8rv9.mongodb.net/indian-tourism";;
mongoose.set('strictQuery', false);
mongoose.connect(dataBase, {
 	useNewUrlParser: true,
	useUnifiedTopology: true,},
	(err) => {
		if (err) {
			console.log("Error connecting to database");
		} else {
			console.log("Connected to database");
		}
	}
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use('/', homeRoutes);
app.use('/api/auth/', authRoutes);
app.use('/api/update/', updateRoutes);




app.listen(process.env.PORT, () => {
	console.log("Server started on port 4000");
});
