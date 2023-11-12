const express = require('express');

const scannerRoutes = express.Router();

const { scannerFetchController } = require('../controllers/scanner/scannerController');
const { scannerAllowController } = require('../controllers/scanner/scannerController');
const { scannerVerifyController } = require('../controllers/scanner/scannerController');

scannerRoutes.post('', scannerFetchController);
scannerRoutes.post('/allow', scannerAllowController);
scannerRoutes.post('/verify', scannerVerifyController);

module.exports = scannerRoutes;
