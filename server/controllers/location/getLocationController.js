const LocationModel = require('../../models/locationModel');

const getRandomLocationsController = async (req, res, next) => {
	const locations = await LocationModel.aggregate([
		{ $sample: { size: 4 } }
	]);
    res.status(200).json(locations);
}

const getLocationController = async (req, res, next) => {

	const locationId = req.params.locationId;

	const locationIdSearchResult = await LocationModel.findOne({ _id: locationId });
	if(locationIdSearchResult === null) {
		return res.status(404).json({
			status: "failure",
			message: 'Location not found or invalid location ID'
		});
	}
	else{
		return res.status(200).json({
			message: 'Location found',
			location: locationIdSearchResult
		});
	}
}


const getLocationByStateController = async (req, res, next) => {
	state = req.params.state;
	const locations = await LocationModel.find({ state: state }).exec();
	if(locations === null) {
		return res.status(500).json({
			status: "failure",
			message: 'Error getting locations by state'
		});
	}
	else {
    	res.status(200).json(locations);
	}
}


const getLocationByCityController = async (req, res, next) => {
	city = req.params.city;
	const locations = await LocationModel.find({ city: city }).exec();
	if(locations === null) {
		return res.status(500).json({
			status: "failure",
			message: 'Error getting locations by city'
		});
	}
	else {
    	res.status(200).json(locations);
	}
}

module.exports = {
	getLocationController,
	getRandomLocationsController,
	getLocationByStateController,
	getLocationByCityController
}