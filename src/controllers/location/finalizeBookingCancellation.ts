import { Request, Response } from "express";
import { CancellationModel } from "@models/cancellation";
import { BookingModel } from "@models/bookings";
import { UserModel } from "@models/user";
import { AvailabilityModel } from "@models/availability";
import { apiResponse, apiError } from "@utils/responseHelper";

const bookingCancellationController = async (req: Request, res: Response) => {
    const { bookingId, adminId } = req.body;

    const cancellationData = await CancellationModel.findOne({
        bookingId,
        adminId,
    });

    if (!cancellationData) {
        return apiResponse(res, 404, "cancellation data not found");
    }

    console.log("Cancellation data found:", cancellationData);

    const bookingUpdateResult = await BookingModel.updateOne(
        { bookingId },
        { cancellationStatus: "approved" }
    );

    if (!bookingUpdateResult) {
        return apiResponse(res, 400, "failed to update booking data");
    }

    console.log("Booking model updated successfully");

    const userWalletUpdateResult = await UserModel.updateOne(
        { _id: cancellationData.userId },
        { $inc: { walletBalance: cancellationData.bookingPrice } }
    );

    if (!userWalletUpdateResult) {
        return apiError(res, 400, "failed to update user wallet");
    }

    console.log("Wallet Balance Updated");

    const cancellationDeleteResult = await CancellationModel.deleteOne({
        bookingId,
        adminId,
    });

    if (!cancellationDeleteResult) {
        console.log("Cannot delete cancellation data from cancellation model");
        return apiError(res, 400, "failed to delete cancellation entry");
    }

    const locationAvailabilityData = await AvailabilityModel.findOne({
        locationId: cancellationData.locationId,
    });

    if (!locationAvailabilityData) {
        console.log("Location availability data does not exist");
        return apiError(res, 404, "locaiton availability data not found");
    }

    let isDateFound = false;
    const dateOfVisit = new Date(cancellationData.dateOfVisit);

    for (const month of locationAvailabilityData.calendarMonths) {
        if (month.month === dateOfVisit.getMonth() + 1) {
            for (const day of month.days) {
                const currentDate = new Date(day.calendarDate).getDate();
                if (currentDate === dateOfVisit.getDate()) {
                    isDateFound = true;
                    day.availableTickets += cancellationData.noOfTickets;
                    break;
                }
            }
            if (isDateFound) break;
        }
    }

    await locationAvailabilityData.save();

    if (isDateFound) {
        return apiResponse(res, 200, "booking cancelled successfully");
    }
};

export default bookingCancellationController;
