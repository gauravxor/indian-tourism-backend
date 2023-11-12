const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const loginController = async (req, res) => {
    const requestEmail = req.body.email;
    const requestPassword = req.body.password;
    let isUserAdmin = req.body.isAdmin;

    if (requestEmail === '' || requestPassword === '') {
        console.log('Login Controller: Bad Request'.red);
        return res.status(400).send({
            status: 'failure',
            msg: 'Bad Request',
        });
    }
    isUserAdmin = (isUserAdmin === 'true');
    console.log('Login Controller: Is User Admin ? '.yellow + ` ${isUserAdmin}`.cyan);

    let searchUserResult;
    if (isUserAdmin === true) searchUserResult = await AUTH.searchAdmin(requestEmail);
    else searchUserResult = await AUTH.searchUser(requestEmail);

    if (searchUserResult === null) {
        console.log('Login Controller: User not found'.red);
        return res.status(404).send({
            status: 'failure',
            msg: 'User not found',
        });
    }
    /*
     * Storing  userid and email to use in the token generation.
     * Data from request is not used for security reasons
    */
    const userId = searchUserResult._id;
    const userEmail = searchUserResult.contact.email;

    // local and admin user credentials are saved in the same collection
    const searchCredentialsResult = await AUTH.searchCredentials(userId);

    if (searchCredentialsResult === null) {
        console.log('Login Controller: User credentials not found'.red);
        return res.status(404).json({
            status: 'failure',
            msg: 'User credentials not found',
        });
    }
    const userPasswordHash = searchCredentialsResult.password;
    const validatePassResult = await AUTH.validatePass(requestPassword, userPasswordHash);
    const userType = (isUserAdmin === true) ? 'admin' : 'local';
    /** If password hash matches */
    if (validatePassResult) {
        const accessToken = TOKENIZER.generateAccessToken(userId, userEmail, userType);
        const refreshToken = TOKENIZER.generateRefreshToken(userId, userEmail, userType);

        /*
         * Change the login status by updating the refresh token.
         * Any old session will be deleted.
        */
        await AUTH.updateLoginStatus(searchCredentialsResult._id, refreshToken);

        /** Checking if the user was already logged in from other device */
        if (searchCredentialsResult.refreshToken !== '') {
            /** Sending appropriate response by updating the frontend cookies */
            console.log('Login Controller : Deleted the old session'.yellow);
            return res
                .status(200)
                .cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', secure: false })
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: false })
                .send({
                    status: 'failure',
                    msg: 'Duplicate Session',
                    userId: userId,
                });
        }
        /** If email is verified continue or else move to verification */
        if (searchUserResult.isEmailVerified === false) {
            return res.status(200).send({
                status: 'failure',
                msg: 'Email not verified',
                userId: userId,
            });
        }
        /** For a fresh login, generate a new refresh token. */
        console.log('Login Controller : Clean Login'.yellow);
        return res
            .cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict', secure: false })
            .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', secure: false })
            .status(200)
            .send({
                status: 'success',
                msg: 'Logged in successfully',
                userId: userId,
            });
    }
    /** If password has does not match */
    console.log('Login Controller: Incorrect Password provided'.red);
    return res.status(404)
        .send({
            status: 'failure',
            msg: 'Incorrect Password',
        });
};
module.exports = loginController;
