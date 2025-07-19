import express = require("express");

const userRoutes = express.Router();

import { verifyAccessToken } from "@middlewares/tokenware";

import { getUserDataController } from "@controllers/user/userDataController";
import { getUserBookingsController } from "@controllers/user/userDataController";

userRoutes.get("/details/:userId", verifyAccessToken, getUserDataController);
userRoutes.get(
    "/bookings/:userId",
    verifyAccessToken,
    getUserBookingsController
);

export { userRoutes };
