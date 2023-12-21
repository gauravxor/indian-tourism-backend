const express = require('express');

const userRoutes = express.Router();

const verifyToken = require('../middlewares/tokenware');

const { getUserDataController } = require('../controllers/user/userDataController');
const { getUserBookingsController } = require('../controllers/user/userDataController');

userRoutes.get('/details/:userId', verifyToken.verifyAccessToken, getUserDataController);
userRoutes.get('/bookings/:userId', verifyToken.verifyAccessToken, getUserBookingsController);

module.exports = userRoutes;
