const UserModel = require('../../models/userModel');
const AdminModel = require('../../models/adminModel');
const { v4: uuidv4 } = require('uuid');  // eslint-disable-line
const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');
const FIREBASE = require('../../helper/firebaseHelper');

const userUpdateController = async (req, res) => {
    const userId = req.userId;

    let oldUserData;
    if (req.userType === 'local') {
        oldUserData = await AUTH.searchUserById(userId);
    } else {
        oldUserData = await AUTH.searchAdminUserById(userId);
    }

    let newImageUrl = oldUserData.userImageURL;

    if (req.file) {
        const { buffer, mimetype } = req.file;
        const directory = 'images/users';
        const oldFileName = oldUserData.userImageURL.split('/').pop();
        const newFileName = `${uuidv4()}.${mimetype.split('/')[1]}`;
        const folderName = oldUserData._id.toString();
        newImageUrl = await FIREBASE.uploadImage(buffer, directory, folderName, oldFileName, newFileName, mimetype);
    }

    const updatedUserData = {
        userImageURL: newImageUrl,
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
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true });
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
};
