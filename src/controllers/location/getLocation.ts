import { LocationModel } from "@models/location";
import { apiResponse, apiError } from "@utils/responseHelper";
import { Request, Response } from "express";

const getRandomLocationsController = async (req: Request, res: Response) => {
    const locations = await LocationModel.aggregate([
        { $sample: { size: 20 } },
    ]);
    return apiResponse(res, 200, "location data fetched", locations);
};

const getLocationController = async (req: Request, res: Response) => {
    const locationId = req.params.locationId;

    const locationIdSearchResult = await LocationModel.findOne({
        _id: locationId,
    });
    if (locationIdSearchResult === null) {
        return apiError(res, 404, "could not fetch locations");
    }
    /** If we get some location data from DB */

    return apiResponse(res, 200, "location found", {
        locations: locationIdSearchResult,
    });
};

const getLocationByQueryController = async (req: Request, res: Response) => {
    const query = req.params.query;
    const locations = await LocationModel.find({
        $text: { $search: query },
    }).exec();
    if (!locations) {
        return apiError(res, 500, "failed to fetch locations");
    }
    return apiResponse(res, 200, "locations found", locations);
};

export {
    getLocationController,
    getRandomLocationsController,
    getLocationByQueryController,
};
