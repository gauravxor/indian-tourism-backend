import { BookingModel } from "@models/bookings";
import { Request, Response } from "express";
import { apiError, apiResponse } from "@utils/responseHelper";

const getBookingDetailsController = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const bookingId = req.body.bookingId;

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return apiError(res, 404, "booking not found");
    }

    return apiResponse(res, 200, "booking details fetched", bookingData);
};

export default getBookingDetailsController;
