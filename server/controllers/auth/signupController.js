const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const color = require('colors');
const User = require('../../models/userModel');
const Credentials = require('../../models/credentialModel');
const authHelper = require('../../helper/authHelper');
const otpHelper = require('../../helper/otpHelper');

const signUpController = async (req, res) => {

	const email = req.body.contact.email;

	const emailSearchResult = await authHelper.searchUser(email);
	if(emailSearchResult != null)
		res.status(200).send({msg: "User already exists"});
	else
	{
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
		console.log("saving the user".green);
		const status = await user.save();
		// console.log(status);
		console.log("saved the user".green);


		const pass = req.body.password;
		console.log("Generating the hash".green);
		const hash = await bcrypt.hash(pass, 10);
		// console.log(hash);
		console.log("Generated the hash".green);


		const credentials = new Credentials({
			userId: user._id,
			password: hash,
			isLoggedIn: false,
		});

		console.log("saving the credentials".green);
		const saveResult = await credentials.save()
		// console.log(saveResult);
		console.log("saved the credentials".green);

		console.log(user._id);


		const emailResult = await otpHelper.emailOtp(user.contact.email, user._id);
		// console.log(emailResult);
		// console.log("this is the email result".green);

		res.status(200).send({msg: "User created successfully"});
	}
};



module.exports = signUpController;