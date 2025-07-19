import { Request, Response } from "express";
import { AvailabilityModel } from "@models/availability";
import { apiResponse, apiError } from "@utils/responseHelper";

const getAvailabilityController = async (req: Request, res: Response) => {
    const locationId = req.params.locationId;
    const currentMonth = (new Date().getMonth() + 1).toString();
    const currentYear = new Date().getFullYear();

    try {
        const availability = await AvailabilityModel.findOne({
            locationId: locationId,
        });
        if (!availability) {
            return apiError(res, 404, "availability data not found");
        }

        const currentMonthIndex = availability.calendarMonths.findIndex(
            (month: any) =>
                month.month === currentMonth && month.year === currentYear
        );

        if (currentMonthIndex === -1) {
            return apiError(res, 404, "availability data not found");
        }

        const currentMonthData =
            availability.calendarMonths.slice(currentMonthIndex);
        const result = {
            _id: availability._id,
            location: availability.locationId, // TODO: check if it would be locationId or just location
            calendarMonths: currentMonthData,
        };

        return apiResponse(res, 200, "availability fetched successfully", {
            availability: result,
        });
    } catch (error) {
        return apiError(res, 500, "error retrieving availability");
    }
};

export default getAvailabilityController;
