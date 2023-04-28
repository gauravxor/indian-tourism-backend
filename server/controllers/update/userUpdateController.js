const UserModel = require('../../models/userModel');
const AdminModel = require('../../models/adminModel');
const AUTH		= require('../../helper/authHelper');
const TOKENIZER	= require('../../helper/jwtHelper');
const fs 	= require('fs');
const path 	= require('path');

const color		= require('colors');
const multer 	= require('multer');

/** Multer storage configuration */
const userImageStorage = multer.diskStorage({

	destination: function (req, file, cb){
	  cb(null, 'public/images/users');
	},

	filename: async function (req, file, cb)
	{
		/** Getting the old user image file */
		let userSearchResult;
		if(req.userType === "user")
			userSearchResult = await UserModel.findById(req.userId);
		else
			userSearchResult = await AdminModel.findById(req.userId);
		const imageUrl = userSearchResult.userImageURL;

		/** Deleting the old user image file */
		if(imageUrl !== "/public/images/users/default.png")
		{
			try{
				const filePath = path.join(__dirname, '..', '..', imageUrl);
				fs.unlinkSync(filePath);
			}
			catch (err){
				console.error(err);
			}
		}
		const newFileName = req.userId + '-' + file.originalname;

		/** Saving the new file name in the request object */
		req.newFileName = newFileName;
		cb(null, newFileName);
	},
});

const userUpload = multer({ storage: userImageStorage });
const userMulterConfig = userUpload.single('userImage');


const userUpdateController = async (req, res, next) => {

	console.log("Inside userUpdateController".bgYellow);

	const userId = req.userId;
	let oldUserData;

	if(req.userType === "user")
		oldUserData = await AUTH.searchUserById(userId);
	else
		oldUserData = await AUTH.searchAdminUserById(userId);

	/** If email is updated then we have to regenerate the acccess tokens
	 * and update the refresh token in the database
	**/
	if(oldUserData.contact.email !== req.body.email)
	{
		console.log("Email changed".bgRed);
		const accessToken = await TOKENIZER.generateAccessToken(userId, req.body.email);
		const refreshToken = await TOKENIZER.generateRefreshToken(userId, req.body.email);
		await AUTH.updateLoginStatusByUserId(userId, refreshToken);
		res.cookie('accessToken',	accessToken, { httpOnly: true, SameSite: true, secure: true});
		res.cookie('refreshToken',	refreshToken,{ httpOnly: true, SameSite: true, secure: true});
	}

	/** If user image is not updated then we have to use the old image */
	var fileName = "/public/images/users/";
	fileName += (req.file === undefined)? "default.png" : req.newFileName;

	const updatedUserData = ({

		userImageURL: fileName,

		name: {
			firstName: req.body.firstName,
			middleName: req.body.middleName,
			lastName: req.body.lastName,
		},
		contact: {
			phone: req.body.phone,
			email: req.body.email,
		},
		address: {
			addressMain: req.body.addressMain,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city,
			pincode: req.body.pincode,
		},

		/** converting ISO date(YYYY-MM-DD) to Date object */
		dob: new Date(req.body.dob),
		updatedAt: Date(),
	});

	/** Updating the user data */
	let saveUserResult;
	if (req.userType === "user")
		saveUserResult = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true});
	else
	if(req.userType === "admin")
		saveUserResult = await AdminModel.findByIdAndUpdate(userId, updatedUserData, { new: true});

	/** Sending the appropriate response */
	if(saveUserResult === null){
		res.status(200).send({
			status: "failure",
			msg: "Error updating user data",
		});
	}
	else{
		res.status(200).send({
			status: "success",
			msg: "User data updated successfully",
		});
	}
}

module.exports = {
	userUpdateController,
	userMulterConfig,
}
