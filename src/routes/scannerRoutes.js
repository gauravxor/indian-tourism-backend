const express = require('express');

const scannerRoutes = express.Router();

const {
    scannerFetchController,
    scannerAllowController,
    scannerVerifyController,
} = require('@controllers/scanner/scannerController');

scannerRoutes.post('', scannerFetchController);
scannerRoutes.post('/allow', scannerAllowController);
scannerRoutes.post('/verify', scannerVerifyController);

module.exports = scannerRoutes;
