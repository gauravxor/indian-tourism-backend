const express = require('express');

const signUpController		= require('../controllers/auth/signupController');
const loginController		= require('../controllers/auth/loginController');
const logoutController		= require('../controllers/auth/logoutController');
const otpController			= require('../controllers/auth/otpController');
const passwordController    = require('../controllers/auth/passwordController');
const verifyToken 	 		= require('../middlewares/verifyToken');
const { resendOtp } 		= require('../helper/otpHelper');


const authRoutes = express.Router();


authRoutes.post('/signup', signUpController);
authRoutes.post('/login', loginController);

authRoutes.post('/logout', verifyToken, logoutController);
authRoutes.post('/verify-otp', verifyToken, otpController);

authRoutes.post('/resend-otp', verifyToken, resendOtp);

authRoutes.post('/forgot-password', passwordController.forgotPassword);
authRoutes.post('/change-password', verifyToken, passwordController.changePassword);


module.exports = authRoutes;
