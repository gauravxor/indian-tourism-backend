import { TempBookingModel } from "@models/lockBooking";
import { apiResponse, apiError } from "@utils/responseHelper";
import { Response, Request } from "express";

const getTempBookingDetailsController = async (req: Request, res: Response) => {
    const lockId = req.params.lockId;
    const bookingData = await TempBookingModel.findOne({ lockId: lockId });
    if (!bookingData) {
        return apiError(res, 404, "booking not found");
    }

    return apiResponse(res, 200, "booking found", bookingData);
};

export { getTempBookingDetailsController };
