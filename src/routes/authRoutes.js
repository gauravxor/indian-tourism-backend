const express = require('express');

const signUpController = require('@controllers/auth/signup');
const loginController = require('@controllers/auth/login');
const logoutController = require('@controllers/auth/logout');
const otpController = require('@controllers/auth/otp');
const passwordController = require('@controllers/auth/password');

const { resendOtp } = require('@helpers/otpHelper');

const authRoutes = express.Router();
authRoutes.post('/login', loginController);
authRoutes.post('/logout', logoutController);
authRoutes.post('/signup', signUpController);

authRoutes.post('/resend-otp', resendOtp);
authRoutes.post('/verify-otp', otpController);

authRoutes.post('/forgot-password', passwordController.forgotPassword);
authRoutes.post('/change-password', passwordController.changePassword);

module.exports = authRoutes;
