import { Response } from "express";

export function apiResponse(
    res: Response,
    statusCode: number = 200,
    message: string = "success",
    data: any = {}
): Response {
    return res.status(statusCode).json({
        message,
        statusCode,
        data,
    });
}

export function apiError(
    res: Response,
    statusCode: number = 500,
    message: string = "failure",
    errors: any = null
): Response {
    return res.status(statusCode).json({
        message,
        statusCode,
        errors,
    });
}
