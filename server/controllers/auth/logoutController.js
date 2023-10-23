const AUTH = require('../../helper/authHelper');


const logoutController = async (req, res) => {

    const requestUserId = req.userId;

    const searchCredentialsResult = await AUTH.searchCredentials(requestUserId);
    if (searchCredentialsResult === null) {
        console.log("LOGOUT CONTROLLER : User credentials not found".red);
        res.status(404).send({
            status: "failure",
            msg: "Credentials not found"
        });
    } else {
        const credentialsDocumentId = searchCredentialsResult._id;
        const updateLoginStatusResult = await AUTH.updateLoginStatus(credentialsDocumentId, "");
        if (updateLoginStatusResult !== null) {
            console.log("LOGOUT CONTROLLER : User logged out".yellow);
            res
                .clearCookie('accessToken', { httpOnly: true, sameSite: "strict", secure: false })
                .clearCookie('refreshToken', { httpOnly: true, sameSite: "strict", secure: false })
                .status(200).send({
                    status: "success",
                    msg: "Logged out successfully",
                });
        } else {
            console.log("LOGOUT CONTROLLER : Failed to logout".red);
            res.status(500).send({
                status: "failure",
                msg: "Error in updating login/logout status"
            });
        }
    }
};

module.exports = logoutController;