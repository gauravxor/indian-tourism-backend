const express 			= require('express');
const bookingRoutes 	= express.Router();
const verifyToken = require('../middlewares/verifyToken');

const bookingLockController = require('../controllers/booking/bookingLockController');
const finalBookingController = require('../controllers/booking/finalBookingController');

const getTempBookingDetailsController = require('../controllers/booking/getTempBookingDetailsController');
const getBookingDetailsController = require('../controllers/booking/getBookingDetailsController');

const getCancellationsController = require('../controllers/location/getCancellationsController');
const cancelRequestController = require('../controllers/location/cancelRequestController');
const bookingCancellationController = require('../controllers/location/bookingCancellationController');


bookingRoutes.post('/lock', verifyToken, bookingLockController);
bookingRoutes.get('/lock/details/:lockId', verifyToken, getTempBookingDetailsController);

bookingRoutes.post('/final', verifyToken, finalBookingController);
bookingRoutes.get('/final/details', verifyToken, getBookingDetailsController);

bookingRoutes.post('/cancel/', verifyToken, cancelRequestController);
bookingRoutes.get('/cancellations/:adminId', verifyToken, getCancellationsController);
bookingRoutes.post('/cancel/approve', verifyToken, bookingCancellationController)

module.exports = bookingRoutes;
