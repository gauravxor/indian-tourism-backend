const UserModel = require('../../models/userModel');
const AdminModel = require('../../models/adminModel');
const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');
const fs = require('fs');
const path = require('path');

const color = require('colors');
const multer = require('multer');

import { defaultUserImage } from "../../fileUrls";

/** Multer storage configuration */
const userImageStorage = multer.diskStorage({

    /** Setting the detination where the incoming image is to be saved */
    destination: function (req, file, cb) {
        cb(null, 'public/images/users');
    },

    /** Generating a file name */
    filename: async function (req, file, cb) {
        /** Getting the old user image file */
        let userSearchResult;
        if (req.userType === "local")
            userSearchResult = await UserModel.findById(req.userId);
        else
            userSearchResult = await AdminModel.findById(req.userId);
        const imageUrl = userSearchResult.userImageURL;
        console.log("User Update Controller : Old user image URL : ".yellow + `${imageUrl}`.cyan);

        /** If user does not have the default image, then delete the old one */
        if (imageUrl !== defaultUserImage) {
            console.log("User Update Controller : Deleting old user image...".yellow);
            try {
                const filePath = path.join(__dirname, '..', '..', imageUrl);
                fs.unlinkSync(filePath);
                console.log("User Update Controller : Old user image deleted".green);
            }
            catch (err) {
                console.log("User Update Controller : Error deleting old user image".red);
                console.error(err);
            }
        }
        const newFileName = req.userId + '-' + file.originalname;
        console.log("The new file name is : " + newFileName);
        /** Saving the new file name in the request object */
        req.newFileName = newFileName;
        cb(null, newFileName);
    },
});

const userUpload = multer({ storage: userImageStorage });
const userMulterConfig = userUpload.single('userImage');


const userUpdateController = async (req, res, next) => {

    const userId = req.userId;
    let oldUserData;

    if (req.userType === "local")
        oldUserData = await AUTH.searchUserById(userId);
    else
        oldUserData = await AUTH.searchAdminUserById(userId);

    /** If email is updated then we have to regenerate the acccess tokens
     * and update the refresh token in the database
    **/
    if (oldUserData.contact.email !== req.body.email) {
        console.log("User Update Controller : Email changed generating new tokens...".yellow);
        const accessToken = await TOKENIZER.generateAccessToken(userId, req.body.email);
        const refreshToken = await TOKENIZER.generateRefreshToken(userId, req.body.email);
        await AUTH.updateLoginStatusByUserId(userId, refreshToken);
        console.log("User Update Controller : Generated tokens for updated emailID".green);
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "strict", secure: false });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: "strict", secure: false });
    }

    /** If user image is not updated then we have to use the old image */
    /** Root path to old image */
    var fileName = "/public/images/users/";

    /** Getting the exact file name from old image URL in DB */
    var oldFileName = oldUserData.userImageURL;
    oldFileName = oldFileName.substring(oldFileName.lastIndexOf('/') + 1);

    fileName += (req.file === undefined) ? oldFileName : req.newFileName;

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
    if (req.userType === "local")
        saveUserResult = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
    else
        if (req.userType === "admin")
            saveUserResult = await AdminModel.findByIdAndUpdate(userId, updatedUserData, { new: true });

    /** Sending the appropriate response */
    if (saveUserResult === null) {
        console.log("User Update Controller : Faild to update user data".red);
        res.status(200).send({
            status: "failure",
            msg: "Error updating user data",
        });
    }
    else {
        console.log("User Update Controller : User data updated".green);
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
