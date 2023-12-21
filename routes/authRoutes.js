const express = require('express');

const signUpController = require('../controllers/auth/signupController');
const loginController = require('../controllers/auth/loginController');
const logoutController = require('../controllers/auth/logoutController');
const otpController = require('../controllers/auth/otpController');
const passwordController = require('../controllers/auth/passwordController');
const { resendOtp } = require('../helper/otpHelper');

const authRoutes = express.Router();

authRoutes.post('/login', loginController);
authRoutes.post('/logout', logoutController);
authRoutes.post('/signup', signUpController);

authRoutes.post('/resend-otp', resendOtp);
authRoutes.post('/verify-otp', otpController);

authRoutes.post('/forgot-password', passwordController.forgotPassword);
authRoutes.post('/change-password', passwordController.changePassword);

module.exports = authRoutes;
