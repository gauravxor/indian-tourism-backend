/**
 * This controller is for testing purpose only
 * It will add a new admin to the database
 * The routes will not be exposed to users
 */


const bcrypt	= require('bcryptjs');
const color 	= require('colors');
const { v4: uuidv4 } = require('uuid');

const AUTH 		= require('../../helper/authHelper');
const OTP  		= require('../../helper/otpHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const AdminModel = require('../../models/adminModel');
const CredentialModel	= require('../../models/credentialModel');
const { UUID } = require('bson');

const {defaultUserImage} = require ("../../fileUrls");

const addAdminController = async (req, res, next) => {

	const requestEmail = req.body.contact.email;
	const adminSearchResult = await AdminModel.findOne({ "contact.email": requestEmail });
	if(adminSearchResult !== null){
		return res.status(200).send({
			status: "failure",
			msg: "Admin already exists"
		});
	}

	const Admin = new AdminModel({
		userImageURL: defaultUserImage,
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
		accessKey: uuidv4()
	});

	const saveAdminResult = await Admin.save();

	/** Generating the password hash */
	const adminPassword = (req.body.password).toString();
	const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
	console.log("ADD ADMIN CONTROLLER : Generated the password hash".yellow);

	const adminDocumentId = saveAdminResult._id;
	const adminEmail = saveAdminResult.contact.email;

	/** Generating Tokens */
	const accessToken = await TOKENIZER.generateAccessToken(adminDocumentId, adminEmail);
	const refreshToken = await TOKENIZER.generateRefreshToken(adminDocumentId, adminEmail);
	console.log("ADD ADMIN CONTROLLER : Generated the access tokens".yellow);


	/** Creating the Credentials Document for the new admin */
	const Credential = new CredentialModel({
		userId: adminDocumentId,
		password: adminPasswordHash,
		refreshToken: refreshToken
	});
	await Credential.save();
	console.log("ADD ADMIN CONTROLLER : Saved admin credentials".yellow);

	await OTP.emailOtp(Admin.contact.email, Admin._id);

	res
	.cookie('accessToken', 	accessToken,	{ httpOnly: true, SameSite: true, secure: false})
	.cookie('refreshToken', refreshToken,	{ httpOnly: true, SameSite: true, secure: false})
	.status(200)
	.send({
		status: "success",
		msg: "Admin Created",
		adminId: Admin._id
	});
}


module.exports = addAdminController;
