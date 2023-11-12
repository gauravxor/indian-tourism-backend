const LocationModel = require('../../models/locationModel');

const getRandomLocationsController = async (req, res) => {
    const locations = await LocationModel.aggregate([
        { $sample: { size: 20 } }
    ]);
    res.status(200).json(locations);
}
const getLocationController = async (req, res) => {
    const locationId = req.params.locationId;

    const locationIdSearchResult = await LocationModel.findOne({ _id: locationId });
    if (locationIdSearchResult === null) {
        return res.status(404).json({
            status: 'failure',
            message: 'Location not found or invalid location ID',
        });
    }
    /** If we get some location data from DB */
    return res.status(200).json({
        status: 'success',
        message: 'Location found',
        location: locationIdSearchResult,
    });
};

const getLocationByQueryController = async (req, res) => {
    const query = req.params.query;
    const locations = await LocationModel.find({ $text: { $search: query } }).exec();
    if (locations === null) {
        return res.status(500).json({
            status: 'failure',
            message: 'Error querying database',
        });
    }
    return res.status(200).json(locations);
};

module.exports = {
    getLocationController,
    getRandomLocationsController,
    getLocationByQueryController,
}