const express = require('express');

const { v4: uuidv4 } = require('uuid');

const locationRoutes = express.Router();
const multer = require('multer');

const verifyToken = require('../middlewares/verifyToken');

const {
    getLocationController,
    getRandomLocationsController,
    getLocationByQueryController,
} = require('../controllers/location/getLocationController');

const addLocationController = require('../controllers/location/addLocationController');

const updateLocationController = require('../controllers/location/updateLocationController');

const getAvailabilityController = require('../controllers/location/getAvailabilityController');

/** Route to get random locations */
locationRoutes.get('', getRandomLocationsController);

/** Route to get location by ID */
locationRoutes.get('/:locationId', getLocationController);

/** Route to get locations by specific query string */
locationRoutes.get('/search/:query', getLocationByQueryController);

const multerConfig = {
    storage: multer.memoryStorage(),
    filename: function (file, cb) {
        const uniqueFilename = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueFilename);
    },
};
const upload = multer(multerConfig);
locationRoutes.post('/add-location', upload.any(), verifyToken, addLocationController);

/** Route to update location data */
locationRoutes.post('/update-location/:locationId', upload.any(), verifyToken, updateLocationController);

/** Route to get availability data of a location */
locationRoutes.get('/get-availability/:locationId', getAvailabilityController);

module.exports = locationRoutes;
