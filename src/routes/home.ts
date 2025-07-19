import express from "express";
import { Request, Response } from "express";
import { apiResponse } from "@utils/responseHelper";

const homeRoutes = express.Router();

homeRoutes.get("/", (req: Request, res: Response) =>
    // res.status(200).json({
    // message: "Welcome to Indian Tourism!!",
    // })
    apiResponse(res, 200, "Welcome to Indian Tourism!!")
);
export { homeRoutes };
