import { Response } from "express";

function setCookie(res: Response, cookieName: string, cookieValue: string) {
    res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
}

export default setCookie;
