const express = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const updateRoutes = express.Router();

const verifyToken = require('../middlewares/tokenware');

const { userUpdateController } = require('../controllers/update/userUpdateController');

// const locationUpdateController = require('../controllers/update/locationUpdateController');

/** Token Verification -> Save the image -> Make changes in database */
updateRoutes.post('/user', verifyToken.verifyAccessToken, upload.single('userImage'), userUpdateController);

// updateRoutes.post('/location', locationUpdateController);

module.exports = updateRoutes;
