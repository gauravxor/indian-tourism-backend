const express = require('express');
const homeRoutes = express.Router();


homeRoutes.get('/', (req, res, next) => {
	res.json({
		message: "Welcome to the home page"
	});
	next();
});

module.exports = homeRoutes;