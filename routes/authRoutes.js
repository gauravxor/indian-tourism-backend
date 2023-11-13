const express = require('express');

const signUpController = require('../controllers/auth/signupController');
const loginController = require('../controllers/auth/loginController');
const otpController = require('../controllers/auth/otpController');
const passwordController = require('../controllers/auth/passwordController');
const { verifyAccessToken, refreshAccessToken } = require('../middlewares/verifyToken');
const { resendOtp } = require('../helper/otpHelper');

const authRoutes = express.Router();

authRoutes.post('/signup', signUpController);
authRoutes.post('/login', loginController);
authRoutes.post('/verify-otp', otpController);
authRoutes.post('/refresh-token', refreshAccessToken);
authRoutes.post('/resend-otp', resendOtp);
authRoutes.post('/forgot-password', passwordController.forgotPassword);
authRoutes.post('/change-password', verifyAccessToken, passwordController.changePassword);

module.exports = authRoutes;
