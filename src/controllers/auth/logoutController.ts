import { apiError } from "@utils/responseHelper";
import { Request, Response } from "express";

const logoutController = (req: Request, res: Response): Response => {
    if (!req.cookies?.accessToken) {
        return apiError(res, 401, "access tokens not provided");
    }

    return res.clearCookie("accessToken").status(204).send();
};

export { logoutController };
