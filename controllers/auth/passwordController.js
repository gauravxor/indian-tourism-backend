const bcrypt = require('bcryptjs');
const AUTH = require('../../helper/authHelper');
const OTP = require('../../helper/otpHelper');
const OtpModel = require('../../models/otpModel');
const CredentialModel = require('../../models/credentialModel');

const forgotPassword = async (req, res) => {
    const requestEmail = req.body.email;

    /** Search if the user exists in the database */
    const searchUserResult = await AUTH.searchUser(requestEmail);

    /** If the user is not found in the database */
    if (searchUserResult === null) {
        console.log('Password Controller: User not found'.yellow);
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'user not found',
                details: 'user not found in database',
            },
        });
    }

    /** If we have the user in the db */
    console.log('Password Controller: User found'.green);
    const userId = searchUserResult._id;

    const sendPasswordResetEmailResult = await OTP.sendPasswordResetEmail(requestEmail, userId);

    /** If password reset email was sent */
    if (sendPasswordResetEmailResult !== null) {
        console.log('Password Controller: Password reset email sent'.yellow);
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'password reset email sent',
                details: 'password reset email sent',
            },
        });
    }

    console.log('Password Controller: Failed to send password reset email'.red);
    return res.status(500).json({
        status: 'failure',
        code: 500,
        error: {
            message: 'reset email not sent',
            details: 'failed to send password reset email',
        },
    });
};

/**
 * Requires authentication
 * This function handles the password change request, once the
 * password reset OTP is validated.
*/
const changePassword = async (req, res) => {
    const requestEmail = req.body.email;
    const newPassword = req.body.newPassword;
    const resetId = req.body.resetId;

    /** If request body does not contain user email and new password */
    if (requestEmail === undefined || newPassword === undefined) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            data: {
                message: 'invalid request body',
                details: 'request body must contain email and new password',
            },
        });
    }

    const searchUserResult = await AUTH.searchUser(requestEmail);
    if (searchUserResult === null) {
        console.log('Password Controller: User not found'.yellow);
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                msg: 'user not found',
                details: 'user not found in database',
            },
        });
    }

    /** If user is found, make sure that the password resetId is valid and has not expired */
    const result = await CredentialModel.findOne({ userId: searchUserResult._id });
    if (result.resetId !== resetId || result.resetIdExpiry - Date.now() <= 0) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                msg: 'invalid resetId',
                details: 'password resetId is invalid',
            },
        });
    }

    /** Searching if any OTP for the User exists in database */
    const otpSearchResult = await OtpModel.findOne({
        emailId: requestEmail,
        otpType: 'passwordReset',
    });

    if (otpSearchResult === null) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'otp not found',
                details: 'password reset otp not found',
            },
        });
    }

    /**
    * To let the user change the password, the password reset OTP must be validated.
    * If the OTP is not validated, then the user must first validate the OTP.
    */
    if (otpSearchResult.isResetOtpValidated === false) {
        console.log('Password Controller : Password reset OTP not verified'.yellow);
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'otp not verified',
                details: 'password reset otp not verified',
            },
        });
    }

    if (otpSearchResult.isResetOtpValidated === true) {
        console.log('Password Controller : Password reset OTP verified'.green);
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        const searchCredentialsResult = await AUTH.searchCredentials(searchUserResult._id);
        const updatePasswordResult = await AUTH.updatePassword(searchCredentialsResult._id, newPasswordHash);

        if (updatePasswordResult) {
            console.log('Password Controller : Deleting OTP collection'.yellow);
            const otpDocumentId = (otpSearchResult._id).toString();
            await OtpModel.findByIdAndDelete(otpDocumentId);
            console.log('Password Controller : Deleted OTP collection'.green);

            // make sure to log client out from the device
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    message: 'password changed',
                    details: 'password changed successfully, use new password to login',
                },
            });
        }
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'password update failed',
                details: 'password update failed',
            },
        });
    }
};

module.exports = {
    changePassword,
    forgotPassword,
};
