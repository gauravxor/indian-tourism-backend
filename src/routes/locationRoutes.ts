import express from "express";
import multer from "multer";

const locationRoutes = express.Router();
import { verifyAccessToken } from "@middlewares/tokenware";

import {
    getLocationController,
    getRandomLocationsController,
    getLocationByQueryController,
} from "@controllers/location/getLocation";

import { addLocationController } from "@controllers/location/addLocation";
import { updateLocationController } from "@controllers/location/updateLocation";

import getAvailabilityController from "@controllers/location/getAvailability";

/** Route to get random locations */
locationRoutes.get("", getRandomLocationsController);

/** Route to get location by ID */
locationRoutes.get("/:locationId", getLocationController);

/** Route to get locations by specific query string */
locationRoutes.get("/search/:query", getLocationByQueryController);

const upload = multer({ storage: multer.memoryStorage() });

locationRoutes.post(
    "/add-location",
    upload.any(),
    verifyAccessToken,
    addLocationController as any
);

/** Route to update location data */
locationRoutes.post(
    "/update-location/:locationId",
    upload.any(),
    verifyAccessToken,
    updateLocationController
);

/** Route to get availability data of a location */
locationRoutes.get("/get-availability/:locationId", getAvailabilityController);

export { locationRoutes };
