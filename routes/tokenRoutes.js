const express = require('express');

const tokenRoutes = express.Router();
const { getAccessTokenExpiryEpoch, refreshAccessToken } = require('../middlewares/tokenware');

tokenRoutes.get('/expiry', getAccessTokenExpiryEpoch);
tokenRoutes.post('', refreshAccessToken);

module.exports = tokenRoutes;
