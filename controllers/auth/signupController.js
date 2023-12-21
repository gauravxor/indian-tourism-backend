const bcrypt = require('bcryptjs');
const AUTH = require('../../helper/authHelper');
const OTP = require('../../helper/otpHelper');
const UserModel = require('../../models/userModel');
const CredentialModel = require('../../models/credentialModel');
const { defaultUserImage } = require('../../fileUrls');

const signUpController = async (req, res) => {
    const userEmail = req.body.contact.email;

    const searchUserResult = await AUTH.searchUser(userEmail);
    if (searchUserResult != null) {
        return res.status(409).json({
            status: 'failure',
            code: 409,
            error: {
                message: 'duplicate email',
                details: 'email id already registered',
            },
        });
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
        },
        ...(req.body.dob && { dob: req.body.dob }),
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
    });

    const saveUserResult = await User.save();
    if (!saveUserResult) {
        console.log('SignUp Controller : Error saving the user data in DB'.red);
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'database failure',
                details: 'error occured while saving the user data in the database',
            },
        });
    }
    console.log('SignUp Controller : User Saved in DB'.green);

    /** Generating the password hash */
    const userPassword = (req.body.password).toString();
    const userPasswordHash = await bcrypt.hash(userPassword, 10);
    console.log('SignUp Controller : Password hash created'.green);

    /** Creating the Credentials Document for the new user */
    const Credentials = new CredentialModel({
        userId: User._id,
        password: userPasswordHash,
    });
    const credentialsSaveResult = await Credentials.save();
    if (credentialsSaveResult === null) {
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'database failure',
                details: 'error occured while saving the user credentails in the database',
            },
        });
    }
    console.log('SignUp Controller : Credentials Saved in DB'.green);

    /** Sending OTP for email verification */
    const sendOtpResult = await OTP.emailOtp(User.contact.email, User._id);
    if (sendOtpResult === null) {
        console.log('SignUp Controller : Email verificatino OTP not sent'.red);
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'otp failure',
                details: 'error sending the verification OTP to the user email id',
            },
        });
    }

    console.log('SignUp Controller : Email verification OTP sent'.green);
    return res.status(201).json({
        status: 'success',
        code: 201,
        data: {
            message: 'user created',
            userId: User._id,
        },
    });
};

module.exports = signUpController;
