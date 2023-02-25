const express = require('express');

const signUpController	= require('../controllers/auth/signupController');
const loginController	= require('../controllers/auth/loginController');
const logoutController	= require('../controllers/auth/logoutController');
const otpController		= require('../controllers/auth/otpController');
// const passResController = require('../controllers/auth/forgotPasswordController');
const verifyToken 	 	= require('../middlewares/verifyToken');
const { resendOtp } 	= require('../helper/otpHelper');


const authRoutes = express.Router();


authRoutes.post('/signup', signUpController);
authRoutes.post('/login', loginController);

authRoutes.post('/logout', verifyToken, logoutController);
authRoutes.post('/verify-otp', verifyToken, otpController);

authRoutes.post('/resend-otp', verifyToken, resendOtp);

// authRoutes.post('/forgot-password', passResController);


module.exports = authRoutes;
