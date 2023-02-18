const express = require('express');
const tokenValidator = require('../middlewares/verifyToken');
const signUpController = require('../controllers/auth/signupController');
const signInController = require('../controllers/auth/loginController');
const logoutController = require('../controllers/auth/logoutController');
const forgotPasswordController = require('../controllers/auth/passwordController');
const tokenController = require('../controllers/auth/tokenController')



const authRoutes = express.Router();

authRoutes.post('/signup', signUpController);
authRoutes.post('/signin', signInController);


// authRoutes.post('/logout', logoutController);
// authRoutes.post('/forgot-password', passwordController);
// authRoutes.get('/refresh-token', tokenController);


module.exports = authRoutes;
