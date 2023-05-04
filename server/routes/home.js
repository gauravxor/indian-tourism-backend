const express = require('express');
const homeRoutes = express.Router();


homeRoutes.get('/', (req, res) => {
	return res.status(200).json({
		message: "Welcome to Indian Tourism!!"
	});
});

module.exports = homeRoutes;