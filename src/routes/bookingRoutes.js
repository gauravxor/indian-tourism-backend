const express = require('express');

const bookingRoutes = express.Router();
const { verifyAccessToken } = require('@middlewares/tokenware');

const bookingLockController = require('@controllers/booking/lock');
const finalBookingController = require('@controllers/booking/finalize');

const getTempBookingDetailsController = require('@controllers/booking/tempDetails');
const getBookingDetailsController = require('@controllers/booking/details');

const getCancellationsController = require('@controllers/location/getCancellations');
const cancelRequestController = require('@controllers/location/cancelBooking');
const bookingCancellationController = require('@controllers/location/finalizeBookingCancellation');

bookingRoutes.post('/lock', verifyAccessToken, bookingLockController);
bookingRoutes.get('/lock/details/:lockId', verifyAccessToken, getTempBookingDetailsController);

bookingRoutes.post('/final', verifyAccessToken, finalBookingController);
bookingRoutes.get('/final/details', verifyAccessToken, getBookingDetailsController);

bookingRoutes.post('/cancel/', verifyAccessToken, cancelRequestController);
bookingRoutes.get('/cancellations/:adminId', verifyAccessToken, getCancellationsController);
bookingRoutes.post('/cancel/approve', verifyAccessToken, bookingCancellationController);

module.exports = bookingRoutes;
