const express 			= require('express');
const bookingRoutes 	= express.Router();
const verifyToken = require('../middlewares/verifyToken');

const bookingLockController = require('../controllers/booking/bookingLockController');
const finalBookingController = require('../controllers/booking/finalBookingController');

const getTempBookingDetailsController = require('../controllers/booking/getTempBookingDetailsController');
const getBookingDetailsController = require('../controllers/booking/getBookingDetailsController');


bookingRoutes.post('/lock', verifyToken, bookingLockController);
bookingRoutes.get('/lock/details', verifyToken, getTempBookingDetailsController);

bookingRoutes.post('/final', verifyToken, finalBookingController);
bookingRoutes.get('/final/details', verifyToken, getBookingDetailsController);


module.exports = bookingRoutes;
