const express 		= require('express');
const updateRoutes 	= express.Router();

const verifyToken 	= require('../middlewares/verifyToken');

const {userUpdateController, userMulterConfig} = require('../controllers/update/userUpdateController')

// const locationUpdateController 	= require('../controllers/update/locationUpdateController');


/** Token Verification -> Save the image -> Make changes in database */
updateRoutes.post('/user', verifyToken, userMulterConfig, userUpdateController);


// updateRoutes.post('/location', locationUpdateController);


module.exports = updateRoutes;