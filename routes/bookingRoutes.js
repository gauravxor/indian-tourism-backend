const express = require('express');

const bookingRoutes = express.Router();
const { verifyAccessToken } = require('../middlewares/tokenware');

const bookingLockController = require('../controllers/booking/bookingLockController');
const finalBookingController = require('../controllers/booking/finalBookingController');

const getTempBookingDetailsController = require('../controllers/booking/getTempBookingDetailsController');
const getBookingDetailsController = require('../controllers/booking/getBookingDetailsController');

const getCancellationsController = require('../controllers/location/getCancellationsController');
const cancelRequestController = require('../controllers/location/cancelRequestController');
const bookingCancellationController = require('../controllers/location/bookingCancellationController');

bookingRoutes.post('/lock', verifyAccessToken, bookingLockController);
bookingRoutes.get('/lock/details/:lockId', verifyAccessToken, getTempBookingDetailsController);

bookingRoutes.post('/final', verifyAccessToken, finalBookingController);
bookingRoutes.get('/final/details', verifyAccessToken, getBookingDetailsController);

bookingRoutes.post('/cancel/', verifyAccessToken, cancelRequestController);
bookingRoutes.get('/cancellations/:adminId', verifyAccessToken, getCancellationsController);
bookingRoutes.post('/cancel/approve', verifyAccessToken, bookingCancellationController);

module.exports = bookingRoutes;
