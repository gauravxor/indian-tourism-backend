import express from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const updateRoutes = express.Router();

import { verifyAccessToken } from "@middlewares/tokenware";

import { userUpdateController } from "@controllers/update/userUpdateController";

// const locationUpdateController = require('../controllers/update/locationUpdateController');

/** Token Verification -> Save the image -> Make changes in database */
updateRoutes.post(
    "/user",
    verifyAccessToken,
    upload.single("userImage"),
    userUpdateController
);

// updateRoutes.post('/location', locationUpdateController);

export { updateRoutes };
