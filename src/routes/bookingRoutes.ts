import express from "express";

const bookingRoutes = express.Router();

import { verifyAccessToken } from "@middlewares/tokenware";

import { bookingLockController } from "@controllers/booking/lock";
import { finalBookingController } from "@controllers/booking/finalize";

import { getTempBookingDetailsController } from "@controllers/booking/tempDetails";
import getBookingDetailsController from "@controllers/booking/details";

import { getCancellationsController } from "@controllers/location/getCancellations";
import cancelRequestController from "@controllers/location/cancelBooking";
import bookingCancellationController from "@controllers/location/finalizeBookingCancellation";

bookingRoutes.post("/lock", verifyAccessToken, bookingLockController);
bookingRoutes.get(
    "/lock/details/:lockId",
    verifyAccessToken,
    getTempBookingDetailsController
);

bookingRoutes.post("/final", verifyAccessToken, finalBookingController);
bookingRoutes.get(
    "/final/details",
    verifyAccessToken,
    getBookingDetailsController
);

bookingRoutes.post("/cancel/", verifyAccessToken, cancelRequestController);
bookingRoutes.get(
    "/cancellations/:adminId",
    verifyAccessToken,
    getCancellationsController
);
bookingRoutes.post(
    "/cancel/approve",
    verifyAccessToken,
    bookingCancellationController
);

export { bookingRoutes };
