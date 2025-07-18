const bcrypt = require('bcryptjs');
const AUTH = require('@helpers/authHelper');
const OTP = require('@helpers/otpHelper');
const UserModel = require('@models/user');
const CredentialModel = require('@models/credential');
const { defaultUserImage } = require('@root/src/fileUrls');

const {
    apiError,
    apiResponse,
} = require('@utils/responseHelper');

const signUpController = async (req, res) => {
    const userEmail = req.body.contact.email;

    const searchUserResult = await AUTH.searchUser(userEmail);
    if (searchUserResult != null) {
        return apiError(res, 409, 'user already registered');
    }

    /** If we have a new user */
    const User = new UserModel({
        userImageURL: defaultUserImage,
        name: {
            firstName: req.body.name.firstName,
            lastName: req.body.name.lastName,
        },
        contact: {
            email: req.body.contact.email,
        },
        address: {
            country: req.body.address.country,
        }, ...(req.body.dob && { dob: req.body.dob }),
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
    });

    const saveUserResult = await User.save();
    if (!saveUserResult) {
        console.log('SignUp Controller : Error saving the user data in DB');
        return apiError(res, 500, 'internal server error');
    }
    console.log('SignUp Controller : User Saved in DB');

    /** Generating the password hash */
    const userPassword = (req.body.password).toString();
    const userPasswordHash = await bcrypt.hash(userPassword, 10);
    console.log('SignUp Controller : Password hash created');

    /** Creating the Credentials Document for the new user */
    const Credentials = new CredentialModel({
        userId: User._id,
        password: userPasswordHash,
    });
    const credentialsSaveResult = await Credentials.save();
    if (credentialsSaveResult === null) {
        return apiError(res, 500, 'internal server error');
    }
    console.log('SignUp Controller : Credentials Saved in DB');

    /** Sending OTP for email verification */
    const sendOtpResult = await OTP.emailOtp(User.contact.email, User._id);
    if (sendOtpResult === null) {
        console.log('SignUp Controller : Email verification OTP not sent');
        return apiError(res, 500, 'internal server error');
    }

    console.log('SignUp Controller : Email verification OTP sent');
    return apiResponse(res, 201, 'user created');
};

module.exports = signUpController;
