const bcrypt = require('bcrypt');
const color = require('colors');
const Tokeniser = require('../../helper/jwtHelper');
const User = require('../../models/userModel');
const Credentials = require('../../models/credentialModel');
const Auth = require('../../helper/authHelper');
const Otp  = require('../../helper/otpHelper');

const signUpController = async (req, res) => {
	const email = req.body.contact.email;


	const emailSearchResult = await Auth.searchUser(email);
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
				country: req.body.address.country,
				state: req.body.address.state,
				city: req.body.address.city,
				pincode: req.body.address.pincode,
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
		const saveUserResult = await user.save();
		console.log("saved the user".green);

		// generating the password hash
		const userPassword = req.body.password;
		const hash = await bcrypt.hash(userPassword, 10);

		// creating the new credentials document
		const credentials = new Credentials({
			userId: user._id,
			password: hash,
			isLoggedIn: false,
		});


		await credentials.save();

		await Otp.emailOtp(user.contact.email, user._id);

		const userDocId = saveUserResult._id;
		const userEmail = saveUserResult.contact.email;
		const accessToken = await Tokeniser.generateAccessToken(userDocId, userEmail);
		const refreshToken = await Tokeniser.generateRefreshToken(userDocId, userEmail);

		console.log("generated the token".green);
		res.cookie('accessToken', accessToken,{httpOnly: true})
		.cookie('refreshToken', refreshToken, {httpOnly: true})
		.status(200)
		.send({
			msg: "User created successfully",
			accessToken: accessToken,
			refreshToken: refreshToken
		});
	}
};



module.exports = signUpController;