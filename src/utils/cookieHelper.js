function setCookie(res, cookieName, cookieValue) {
    res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
}

module.exports = {
    setCookie,
};
