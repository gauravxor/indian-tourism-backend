import qrcode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import { TempBookingModel } from "@models/lockBooking";
import { BookingModel } from "@models/bookings";
import { UserModel } from "@models/user";
import uploadImage from "@helpers/firebaseHelper";

import sendQrCode from "@helpers/bookingHelper";
import { Response } from "express";
import { AuthenticationRequest } from "@middlewares/tokenware";
import { apiError, apiResponse } from "@utils/responseHelper";

/**
 * Once the user pays, the user will send the booking id and the payment id to the
 * finalbooking controller which will check the payment id and the booking id and
 * confirm the booking and send a permanent booking id to the user. It will also delete the
 * temporary booking id.
 */
const finalBookingController = async (
    req: AuthenticationRequest,
    res: Response
) => {
    const lockId = req.body.lockId;
    const userId = req.userId;

    const bookingData = await TempBookingModel.findOne({ lockId: lockId });
    if (!bookingData) {
        return apiError(res, 400, "invalid booking id");
    }
    const bookingId = uuidv4();

    const bookingSchema = new BookingModel({
        bookingId: bookingId,
        locationId: bookingData.locationId,
        locationName: bookingData.locationName,
        locationDesc: bookingData.locationDesc,
        locationAddress: bookingData.locationAddress,

        userId: userId,
        userName: bookingData.userName,
        dateOfVisit: bookingData.dateOfVisit,
        noOfTickets: bookingData.noOfTickets,
        bookingPrice: bookingData.bookingPrice,
        timeOfBooking: new Date(),
    });

    const bookingDataSaveResult = await bookingSchema.save();

    if (!bookingDataSaveResult) {
        console.log("Booking Controller : Error saving booking data");
        return apiResponse(res, 400, "error saving booking data");
    }

    console.log("Booking Controller : Booking data saved in DB");
    const userModelUpdateResult = await UserModel.findByIdAndUpdate(
        req.userId,
        {
            $push: { bookings: { bookingId: bookingId } },
            $inc: { bookingCount: 1 },
        }
    );

    if (userModelUpdateResult === null) {
        console.log("Failed to add bookingId in User document");
        return apiError(res, 400, "error saving booking data");
    }

    /** Delete the lock booking data */
    const deleteLockIdResult = await TempBookingModel.deleteOne({
        lockId: lockId,
    });
    if (!deleteLockIdResult) {
        console.log("Booking Controller : Failed to delete LOCK data");
    } else {
        console.log("Booking Controller : LOCK data deleted");
    }

    const qrBuffer = await qrcode.toBuffer(bookingId, {
        version: 5,
        errorCorrectionLevel: "H",
        margin: 1,
        scale: 10,
    });
    await uploadImage(
        qrBuffer,
        "qr",
        null,
        null,
        `${bookingId}.png`,
        "image/png"
    );

    /** Once QR is generated send send it to user with booking details */
    const sendEmailResult = await sendQrCode(
        bookingId,
        req.userEmail as string,
        bookingDataSaveResult
    );
    // TODO: Implement a retry queue for sending confirmation emails
    if (sendEmailResult) {
        console.log("Booking Controller : QR code emailed");
    } else {
        console.log("Booking Controller : Failed to send QR code");
    }
    return apiResponse(res, 200, "booking successfull", {
        bookingId: bookingId,
    });
};

export { finalBookingController };
