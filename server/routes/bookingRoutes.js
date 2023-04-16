const express 			= require('express');
const bookingRoutes 	= express.Router();
const verifyToken = require('../middlewares/verifyToken');

const bookingLockController = require('../controllers/booking/bookingLockController');
const finalBookingController = require('../controllers/booking/finalBookingController');

bookingRoutes.post('/lock', verifyToken, bookingLockController);

bookingRoutes.post('/final', verifyToken, finalBookingController);


module.exports = bookingRoutes;
