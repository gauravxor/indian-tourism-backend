const bcrypt	= require('bcrypt');
const color 	= require('colors');

const AUTH 		= require('../../helper/authHelper');
const OTP  		= require('../../helper/otpHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const UserModel 		= require('../../models/userModel');
const CredentialModel	= require('../../models/credentialModel');


const signUpController = async (req, res) => {
	const requestEmail = req.body.contact.email;

	const searchUserResult = await AUTH.searchUser(requestEmail);
	if(searchUserResult != null){
		res.status(200).send({
			msg: "User already exists"
		});
	}
	else{
		const User = new UserModel({
			userImageURL: "/public/images/user/default.png",
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
			updatedAt: req.body.updatedAt
		});
		const saveUserResult = await User.save();

		/** Generating the password hash */
		const userPassword = req.body.password;
		const userPasswordHash = await bcrypt.hash(userPassword, 10);
		console.log("generated the password".green);

		const userDocumentId = saveUserResult._id;
		const userEmail = saveUserResult.contact.email;

		/** Generating Tokens */
		const accessToken = await TOKENIZER.generateAccessToken(userDocumentId, userEmail);
		const refreshToken = await TOKENIZER.generateRefreshToken(userDocumentId, userEmail);
		console.log("generated the token".green);

		/** Creating the Credentials Document for the new user */
		const Credentials = new CredentialModel({
			userId: User._id,
			password: userPasswordHash,
			refreshToken: refreshToken,
		});
		await Credentials.save();

		// sending the OTP via email
		await OTP.emailOtp(User.contact.email, User._id);

		res
		.cookie('accessToken', 	accessToken,	{ httpOnly: true, SameSite: true, secure: true})
		.cookie('refreshToken', refreshToken,	{ httpOnly: true, SameSite: true, secure: true})
		.status(200)
		.send({
			msg: "User created successfully",
		});
	}
};

module.exports = signUpController;