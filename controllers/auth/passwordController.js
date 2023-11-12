const bcrypt = require('bcryptjs');
const AUTH = require('../../helper/authHelper');
const OTP = require('../../helper/otpHelper');
const OtpModel = require('../../models/otpModel');
const verifyToken = require('../../middlewares/verifyToken');

const changePassword = async (req, res) => {
    const requestEmail = req.body.email;
    const requestPassword = req.body.password;
    const requestNewPassword = req.body.newPassword;

    /** Search if the user exists in the database */
    const searchUserResult = await AUTH.searchUser(requestEmail);

    if (searchUserResult === null) {
        console.log('Password Controller: User not found'.yellow);
        return res.status(404).send({
            status: 'failure',
            msg: 'User not found',
        });
    }
    /** If user is found, search for their credentials */
    const userId = searchUserResult._id;
    const searchCredentialsResult = await AUTH.searchCredentials(userId);

    if (searchCredentialsResult === null) {
        console.log('Password Controller: User credentials not found'.red);
        return res.status(404).send({
            status: 'failure',
            msg: 'Something went wrong, user credentials not found',
        });
    }

    /** If credentials are found, check if the user is logged in */
    if (searchCredentialsResult.refreshToken === '') {
        console.log('Password Controller: User not logged in'.yellow);
        return res.status(401).send({
            status: 'failure',
            msg: 'User must be logged in to change password',
        });
    }

    /** If user is logged in */
    const userPasswordHash = searchCredentialsResult.password;
    const validatePassResult = await AUTH.validatePass(requestPassword, userPasswordHash);

    /** If old user password provided, is valid */
    if (validatePassResult) {
        const newPasswordHash = await bcrypt.hash(requestNewPassword, 10);
        const updatePasswordResult = await AUTH.updatePassword(searchCredentialsResult._id, newPasswordHash);
        if (updatePasswordResult) {
            console.log('Password Controller: Password updated'.green);
            return res.status(200).send({
                status: 'success',
                msg: 'Password updated successfully!',
            });
        }

        /** If password updation fails */
        console.log('Password Controller: Failed to update password'.red);
        return res.status(500).send({
            status: 'failure',
            msg: 'Failed to update password',
        });
    }

    /** If current password is invalid */
    console.log('Password Controller: Invalid current password'.yellow);
    return res.status(400).send({
        status: 'failure',
        msg: 'Invalid current password',
    });
};

/**
 * WORKING
 * User clicks forgot password button and enters their email id which is then sent to the server for
 * verification. If the user exists, then an otp is sent to the user's email id.
 * The sever returns a success message to the client along with an access token and a refresh token.
 *
 * The client will show a box to enter otp that will be sent to server using "verify-otp" route.
 * After veritification, the client will display a box to enter the new password.
 * Which will be sent to server using "change-password" route.
 */

const forgotPassword = async (req, res) => {
    const requestEmail = req.body.email;

    /** Search if the user exists in the database */
    const searchUserResult = await AUTH.searchUser(requestEmail);

    if (searchUserResult === null) {
        console.log('Password Controller: User not found'.yellow);
        return res.status(404).send({
            status: 'failure',
            msg: 'Invalid details',
        });
    }
    /** If the request body has cookies then the user is trying to send a new password */
    if (JSON.stringify(req.cookies) !== '{}' && req.cookies.accessToken !== '' && req.cookies.refreshToken !== '') {
        console.log('Password Controller: Cookies received.... '.yellow);
        console.log('Password Controller: Attempting to reset password'.yellow);
        if (req.body.newPassword === undefined || req.body.email === undefined) {
            console.log('Password Controller: Invalid request body, clearing out cookies...'.red);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.status(400).json({
                status: 'failure',
                msg: 'Invalid request body',
            });
        }
        /** Searching if any OTP for the User exists in database */
        const otpSearchResult = await OtpModel.findOne({
            emailId: requestEmail,
            otpType: 'passwordReset',
        });

        /**
         * To let the user change the password, the password reset OTP must be validated.
         * If the OTP is not validated, then the user must first validate the OTP.
        */
        if (otpSearchResult === null) {
            return res.status(401).json({
                status: 'failure',
                msg: 'OTP not found',
            });
        }
        if (otpSearchResult.isResetOtpValidated === false) {
            console.log('Password Controller : Password reset OTP not verified'.yellow);
            return res.status(401).json({
                status: 'failure',
                msg: 'Otp not yet verified',
            });
        }
        if (otpSearchResult.isResetOtpValidated === true) {
            console.log('Password Controller : Password reset OTP verified'.green);

            /** The tokens received through cookies must be validated */
            await verifyToken(req, res);

            const requestNewPassword = req.body.newPassword;
            const newPasswordHash = await bcrypt.hash(requestNewPassword, 10);
            const searchCredentialsResult = await AUTH.searchCredentials(searchUserResult._id);
            const updatePasswordResult = await AUTH.updatePassword(searchCredentialsResult._id, newPasswordHash);

            if (updatePasswordResult) {
                console.log('Password Controller : Deleting OTP collection'.yellow);
                const otpDocumentId = (otpSearchResult._id).toString();
                await OtpModel.findByIdAndDelete(otpDocumentId);
                console.log('Password Controller : Deleted OTP collection'.green);
                await AUTH.updateLoginStatus(searchCredentialsResult._id, '');

                return res
                    .clearCookie('accessToken')
                    .clearCookie('refreshToken')
                    .status(200)
                    .send({
                        status: 'success',
                        msg: 'Password changed successfully! User your new password to login',
                    });
            }
            return res.status(500).send({
                status: 'failure',
                msg: 'Password update failed',
            });
        }
    } else { /** If the request body has no cookies then the user is trying to send an otp */
        console.log('Password Controller: User found'.green);
        const userId = searchUserResult._id;

        /** For security reason we are not using the "requestEmail" data */
        const userEmail = searchUserResult.contact.email;

        const sendPasswordResetEmailResult = await OTP.sendPasswordResetEmail(userEmail, userId);

        /** If email was sent successfully, send out Access & Refresh Tokens */
        if (sendPasswordResetEmailResult !== null) {
            console.log('Password Controller: Password reset email sent'.yellow);
            return res.status(200)
                .json({
                    status: 'success',
                    msg: 'Password reset email sent',
                    otp: sendPasswordResetEmailResult,
                });
        }

        console.log('Password Controller: Failed to send password reset email'.red);
        return res.status(500).send({
            status: 'failure',
            msg: 'Password reset email failed',
        });
    }
    return null;
};

module.exports = {
    changePassword,
    forgotPassword,
};
