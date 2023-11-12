const express = require('express');

const userRoutes = express.Router();

const verifyToken = require('../middlewares/verifyToken');

const { getUserDataController } = require('../controllers/user/userDataController');
const { getUserBookingsController } = require('../controllers/user/userDataController');

userRoutes.get('/details/:userId', verifyToken, getUserDataController);
userRoutes.get('/bookings/:userId', verifyToken, getUserBookingsController);

module.exports = userRoutes;
