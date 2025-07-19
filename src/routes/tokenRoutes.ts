import express from "express";

const tokenRoutes = express.Router();
import {
    getAccessTokenExpiryEpoch,
    refreshAccessToken,
} from "@middlewares/tokenware";

tokenRoutes.get("/expiry", getAccessTokenExpiryEpoch);
tokenRoutes.post("", refreshAccessToken);

export { tokenRoutes };
