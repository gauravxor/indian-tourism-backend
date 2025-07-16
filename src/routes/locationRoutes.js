const express = require('express');
const multer = require('multer');

const locationRoutes = express.Router();
const verifyToken = require('@middlewares/tokenware');

const {
    getLocationController,
    getRandomLocationsController,
    getLocationByQueryController,
} = require('@controllers/location/getLocation');

const addLocationController = require('@controllers/location/addLocation');

const updateLocationController = require('@controllers/location/updateLocation');

const getAvailabilityController = require('@controllers/location/getAvailability');

/** Route to get random locations */
locationRoutes.get('', getRandomLocationsController);

/** Route to get location by ID */
locationRoutes.get('/:locationId', getLocationController);

/** Route to get locations by specific query string */
locationRoutes.get('/search/:query', getLocationByQueryController);

const upload = multer({ storage: multer.memoryStorage() });

locationRoutes.post('/add-location', upload.any(), verifyToken.verifyAccessToken, addLocationController);

/** Route to update location data */
locationRoutes.post('/update-location/:locationId', upload.any(), verifyToken.verifyAccessToken, updateLocationController);

/** Route to get availability data of a location */
locationRoutes.get('/get-availability/:locationId', getAvailabilityController);

module.exports = locationRoutes;
