const fs = require('fs');
const path = require('path');
const multer = require('multer');
const UserModel = require('../../models/userModel');
const AdminModel = require('../../models/adminModel');
const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const { defaultUserImage } = require('../../fileUrls');

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
        if (req.userType === 'local') {
            userSearchResult = await UserModel.findById(req.userId);
        } else {
            userSearchResult = await AdminModel.findById(req.userId);
        }

        const oldImageUrl = userSearchResult.userImageURL;
        console.log('User Update Controller : Old user image URL : '.yellow + `${oldImageUrl}`.cyan);

        /** If user does not have the default image, then delete the old one */
        if (oldImageUrl !== defaultUserImage) {
            console.log('User Update Controller : Deleting old user image...'.yellow);
            try {
                const filePath = path.join(__dirname, '..', '..', oldImageUrl);
                fs.unlinkSync(filePath);
                console.log('User Update Controller : Old user image deleted'.green);
            } catch (err) {
                console.log('User Update Controller : Error deleting old user image'.red);
                console.error(err);
            }
        }
        const newFileName = `${req.userId}-${file.originalname}`;
        console.log(`The new file name is : ${newFileName}`);

        /** Setting the new file name for userUpdateController */
        req.newImagePath = `/public/images/users/${newFileName}`;
        cb(null, newFileName);
    },
});

const userUpload = multer({ storage: userImageStorage });
const userMulterConfig = userUpload.single('userImage');

const userUpdateController = async (req, res) => {
    const userId = req.userId;
    let oldUserData;

    if (req.userType === 'local') {
        oldUserData = await AUTH.searchUserById(userId);
    } else {
        oldUserData = await AUTH.searchAdminUserById(userId);
    }
    const updatedUserData = {
        userImageURL: req.newImagePath || oldUserData.userImageURL,
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        },
        contact: {
            email: req.body.email,
        },
        address: {
            country: req.body.country,
        },
        updatedAt: Date(),
    };
    if (req.body.phone !== 'undefined') updatedUserData.contact.phone = req.body.phone;
    if (req.body.dob !== 'undefined') updatedUserData.dob = new Date(req.body.dob);
    if (req.body.addressMain !== 'undefined') updatedUserData.address.addressMain = req.body.addressMain;
    if (req.body.state !== 'undefined') updatedUserData.address.state = req.body.state;
    if (req.body.city !== 'undefined') updatedUserData.address.city = req.body.city;
    if (req.body.pincode !== 'undefined') updatedUserData.address.pincode = req.body.pincode;

    /** Updating the user data */
    let saveUserResult;
    if (req.userType === 'local') {
        saveUserResult = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
    } else if (req.userType === 'admin') {
        saveUserResult = await AdminModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
    }

    /** Sending the appropriate response */
    if (saveUserResult === null) {
        console.log('User Update Controller : Faild to update user data'.red);
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'User data not updated',
                details: 'Failed to update the DB data',
            },
        });
    }
    console.log('User Update Controller : User data updated'.green);

    /** If email is updated, rotate the tokens with new email */
    const isEmailUpdated = (oldUserData.contact.email !== req.body.email);
    const accessToken = (isEmailUpdated) ? TOKENIZER.generateAccessToken(userId, req.body.email) : null;
    const refreshToken = (isEmailUpdated) ? TOKENIZER.generateRefreshToken(userId, req.body.email) : null;
    if (accessToken) {
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', secure: false });
    }
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'User data updated',
            ...(refreshToken && { refreshToken }),
        },
    });
};

module.exports = {
    userUpdateController,
    userMulterConfig,
};
