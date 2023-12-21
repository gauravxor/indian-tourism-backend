const LocationModel = require('../../models/locationModel');

const getRandomLocationsController = async (req, res) => {
    const locations = await LocationModel.aggregate([
        { $sample: { size: 20 } },
    ]);
    res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'location data fetched',
            details: 'fetched random locations',
            locations,
        },
    });
};

const getLocationController = async (req, res) => {
    const locationId = req.params.locationId;

    const locationIdSearchResult = await LocationModel.findOne({ _id: locationId });
    if (locationIdSearchResult === null) {
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'could not fetch locations',
                details: 'location not found or invalid location ID',
            },
        });
    }
    /** If we get some location data from DB */
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'location found',
            details: 'locations fetched successfully',
            locations: locationIdSearchResult,
        },
    });
};

const getLocationByQueryController = async (req, res) => {
    const query = req.params.query;
    const locations = await LocationModel.find({ $text: { $search: query } }).exec();
    if (locations === null) {
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'could not fetch locations',
                details: 'error querying database',
            },
        });
    }
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'locations found',
            details: 'locations found for the search query',
            locations,
        },
    });
};

module.exports = {
    getLocationController,
    getRandomLocationsController,
    getLocationByQueryController,
};
