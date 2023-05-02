const bcrypt	= require('bcrypt');
const color 	= require('colors');

const AUTH 		= require('../../helper/authHelper');
const OTP  		= require('../../helper/otpHelper');

const UserModel 		= require('../../models/userModel');
const CredentialModel	= require('../../models/credentialModel');


const signUpController = async (req, res) => {
	const requestEmail = req.body.contact.email;

	const searchUserResult = await AUTH.searchUser(requestEmail);
	if(searchUserResult != null){
		return res.status(200).send({
			status: "failure",
			msg: "User already exists"
		});
	}
	else{
		const User = new UserModel({
			userImageURL: "/public/images/users/default.png",
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
			gender: req.body.gender,
			createdAt: req.body.createdAt,
			updatedAt: req.body.updatedAt
		});
		const saveUserResult = await User.save();
		if(saveUserResult === null){
			return res.status(500).send({
				status: "failure",
				msg: "Something went wrong, user not created"
			});
		}
		console.log("SignUp Controller : User Saved in DB".green);

		/** Generating the password hash */
		const userPassword = (req.body.password).toString();
		const userPasswordHash = await bcrypt.hash(userPassword, 10);
		console.log("SignUp Controller : Password hash created".green);

		/** Creating the Credentials Document for the new user */
		const Credentials = new CredentialModel({
			userId: User._id,
			password: userPasswordHash,
			refreshToken: "",
		});
		const credentialsSaveResult = await Credentials.save();
		if(credentialsSaveResult === null){
			return res.status(500).json({
				status: "failure",
				msg: "Something went wrong, user credentials not created"
			});
		}
		console.log("SignUp Controller : Credentials Saved in DB".green);

		/** Sending OTP for email verification */
		const sendOtpResult = await OTP.emailOtp(User.contact.email, User._id);
		if(sendOtpResult === null){
			console.log("SignUp Controller : Email verificatino OTP not sent".red);
			return res.status(500).json({
				status: "failure",
				msg: "Something went wrong, OTP not sent"
			});
		}
		console.log("SignUp Controller : Email verification OTP sent".green);
		res.status(200)
		.json({
			status: "success",
			msg: "User Created",
			userId: User._id
		});
	}
};

module.exports = signUpController;