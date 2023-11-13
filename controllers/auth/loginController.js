const AUTH = require('../../helper/authHelper');
const TOKENIZER = require('../../helper/jwtHelper');

const loginController = async (req, res) => {
    const requestEmail = req.body.email;
    const requestPassword = req.body.password;
    const isUserAdmin = (req.body.isAdmin === 'true');
    console.log('Login Controller: Is User Admin ? '.yellow + ` ${isUserAdmin}`.cyan);

    if (requestEmail === '' || requestPassword === '') {
        console.log('Login Controller: Bad Request'.red);
        return res.status(400).json({
            status: 'failure',
            msg: 'Bad Request',
        });
    }

    let searchUserResult;
    if (isUserAdmin === true) {
        searchUserResult = await AUTH.searchAdmin(requestEmail);
    } else {
        searchUserResult = await AUTH.searchUser(requestEmail);
    }

    if (searchUserResult === null) {
        console.log('Login Controller: User not found'.red);
        return res.status(404).json({
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

    /** Credentials of both 'local' and 'admin' are stored in collection */
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
        /** If email is not verified, then don't generate tokens */
        if (searchUserResult.isEmailVerified === false) {
            return res.status(200).json({
                status: 'failure',
                msg: 'Email not verified',
                userId: userId,
            });
        }

        /** For verified profiles, send the generated access & refresh tokens. */
        console.log('Login Controller : Clean Login'.yellow);
        const accessToken = TOKENIZER.generateAccessToken(userId, userEmail, userType);
        const refreshToken = TOKENIZER.generateRefreshToken(userId, userEmail, userType);

        return res.status(200).json({
            status: 'success',
            msg: 'Logged in successfully',
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }

    /** If password hash does not match */
    console.log('Login Controller: Incorrect Password'.red);
    return res.status(404).json({
        status: 'failure',
        msg: 'Incorrect Password',
    });
};
module.exports = loginController;
