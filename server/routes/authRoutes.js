const express = require('express');

const signUpController = require('../controllers/auth/signupController');
const loginController = require('../controllers/auth/loginController');
const logoutController = require('../controllers/auth/logoutController');
const otpController = require('../controllers/auth/otpController');

const verifyToken = require('../middlewares/verifyToken');

const authRoutes = express.Router();

authRoutes.post('/signup', signUpController);
authRoutes.post('/login', loginController);

authRoutes.post('/logout', verifyToken, logoutController);
authRoutes.post('/verify-otp', verifyToken, otpController);

// authRoutes.post('/forgot-password', passwordController);
// authRoutes.get('/refresh-token', tokenController);


module.exports = authRoutes;
