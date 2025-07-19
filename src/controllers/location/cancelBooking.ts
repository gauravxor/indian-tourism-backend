import { Request, Response } from "express";
import { BookingModel } from "@models/bookings";
import { CancellationModel } from "@models/cancellation";
import { AdminModel } from "@models/admin";
import { apiResponse, apiError } from "@utils/responseHelper";

const cancelRequestController = async (req: Request, res: Response) => {
    const { bookingId } = req.body;

    const bookingData = await BookingModel.findOne({ bookingId });

    if (!bookingData) {
        return apiError(res, 404, "booking data not found");
    }

    const dateToday = new Date();
    const dateOfVisit = new Date(bookingData.dateOfVisit);
    const dateDifferenceInSeconds =
        (dateOfVisit.getTime() - dateToday.getTime()) / 1000;

    if (dateDifferenceInSeconds < 259200) {
        return apiError(res, 400, "booking cannot be cancelled");
    }

    const adminData = await AdminModel.findOne({
        "locations.locationId": bookingData.locationId,
    });

    if (!adminData) {
        return apiError(res, 404, "admin data not found");
    }

    const cancellationData = new CancellationModel({
        bookingId: bookingData.bookingId,
        adminId: adminData._id,
        locationId: bookingData.locationId,
        userId: bookingData.userId,
        dateOfVisit: bookingData.dateOfVisit,
        noOfTickets: bookingData.noOfTickets,
        bookingPrice: bookingData.bookingPrice,
        locationName: bookingData.locationName,
        userName: bookingData.userName,
    });

    const cancellationDataSaveResult = await cancellationData.save();
    if (!cancellationDataSaveResult) {
        return apiError(res, 400, "error saving cancellation data");
    }

    bookingData.cancellationStatus = "pending";
    const bookingDataSaveResult = await bookingData.save();
    if (!bookingDataSaveResult) {
        return apiError(res, 400, "error saving booking data");
    }

    return apiResponse(res, 200, "cancellation request submitted");
};

export default cancelRequestController;
