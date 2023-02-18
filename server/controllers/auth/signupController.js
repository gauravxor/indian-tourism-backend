const bcrypt = require('bcrypt');

const User = require('../../models/userModel');
const Credentials = require('../../models/credentials');
const jwt = require('jsonwebtoken');


const signUpController = (req, res, next) => {
	const user = new User({
		userName: req.body.userName,
		name: {
			firstName: req.body.name.firstName,
			middleName: req.body.name.middleName,
			lastName: req.body.name.lastName,
		},
		contact: {
			phone: req.body.contact.phone,
			email: req.body.contact.email,
		},
		address: {
			addressMain: req.body.address.addressMain,
			// country: req.body.address.country,
		},
		dob: req.body.dob,
		createdAt: req.body.createdAt,
		updatedAt: req.body.updatedAt,
		bookings: {
			bookingDate: req.body.bookings.bookingDate,
			dateOfVisit: req.body.bookings.dateOfVisit,
			children: req.body.bookings.children,
			adults: req.body.bookings.adults,
		}
	});

	user.save();

	const pass = req.body.password;
	function hashPassword(pass) {
	bcrypt.hash(pass, 10)
	.then(hash => {
		const credentials = new Credentials({
			userId: user._id,
			password: hash,
			isLoggedIn: true,
		});
		credentials.save();
	}).catch(err => {
	console.log(err)
	})};
	hashPassword(pass);
	// bcrypt.hash(pass, process.env.SALT_ROUNDS, (err, hash) => {
	// 	if(err){
	// 		res.status(400).send({msg: "Error in hashing"});
	// 	}
	// 	else{
	// 		const credentials = new Credentials({
	// 			userId: user._id,
	// 			password: hash,
	// 			isLoggedIn: true,
	// 		});
	// 		credentials.save();
	// 		// res.status(200).send({msg: "Hashed"});
	// 	}
	//   });

	jwt.sign(req.body.userName, "gaurav", (err, token) => {
		if(err){
			res.status(400).send({msg: "Error in token generation"});
		}
		else{
			res.send({msg: "Token generated", Token: token});
		}
	});

	next();
};
module.exports = signUpController;