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
            code: 400,
            error: {
                message: 'bad request',
                details: 'credentials not provided',
            },
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
            code: 401,
            error: {
                message: 'user not found',
                details: 'user with given email id does not exists',
            },
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
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'something odd happened',
                details: 'credentails for the user was not found',
            },
        });
    }
    const userPasswordHash = searchCredentialsResult.password;
    const validatePassResult = await AUTH.validatePass(requestPassword, userPasswordHash);
    const userType = (isUserAdmin === true) ? 'admin' : 'local';
    /** If password hash matches */
    if (validatePassResult) {
        /** If email is not verified, then don't generate tokens */
        if (searchUserResult.isEmailVerified === false) {
            return res.status(202).json({
                status: 'success',
                code: 202,
                data: {
                    message: 'email not verified',
                    details: 'could not generate tokens because email id not verified',
                },
            });
        }

        /** For verified profiles, send the generated access & refresh tokens. */
        console.log('Login Controller : Clean Login'.yellow);
        const accessToken = TOKENIZER.generateAccessToken(userId, userEmail, userType);
        const refreshToken = TOKENIZER.generateRefreshToken(userId, userEmail, userType);
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'logged in',
                refreshToken: refreshToken,
                userId,
            },
        });
    }

    /** If password hash does not match */
    console.log('Login Controller: Incorrect Password'.red);
    return res.status(401).json({
        status: 'failure',
        code: 401,
        error: {
            message: 'incorrect password',
            details: 'incorrect password was provided',
        },
    });
};
module.exports = loginController;
