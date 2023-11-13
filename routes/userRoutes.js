const express = require('express');

const userRoutes = express.Router();

const verifyToken = require('../middlewares/verifyToken');

const { getUserDataController } = require('../controllers/user/userDataController');
const { getUserBookingsController } = require('../controllers/user/userDataController');

userRoutes.get('/details/:userId', verifyToken.verifyAccessToken, getUserDataController);
userRoutes.get('/bookings/:userId', verifyToken.verifyAccessToken, getUserBookingsController);

module.exports = userRoutes;
