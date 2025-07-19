import { LocationModel } from "@models/location";
import { AvailabilityModel } from "@models/availability";
import { TempBookingModel, ITempBooking } from "@models/lockBooking";
import { UserModel, IUser } from "@models/user";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { apiError, apiResponse } from "@utils/responseHelper";
import { AuthenticationRequest } from "@middlewares/tokenware";

function convertToISODate(dateString: string): Date | null {
    const dateParts = dateString.split("-");
    if (dateParts.length !== 3) return null;

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 4 === 0) maxDays[1] = 29;

    if (month < 0 || month > 11) return null;
    if (day < 1 || day > maxDays[month]) return null;
    if (year < 0 || year > 2025) return null;

    return new Date(year, month, day);
}
/**
 * this will check the booking request and validate for available capacity
 * if we have the capacity, it will decrease it but no of tickets and generate a
 * temporary booking id and return it to the user. The user will use it to pay.
 */

const bookingLockController = async (
    req: AuthenticationRequest,
    res: Response
) => {
    const locationId = req.body.locationId;
    const userId = req.userId;
    const noOfTickets = req.body.noOfTickets;

    console.log(`${"Booking Lock Controller : User ID "} ${userId}`);
    if (!locationId || !userId || !noOfTickets) {
        console.log("Booking Lock Controller : Invalid request");
        return apiError(
            res,
            400,
            "locationId, userId, noOfTickets are required"
        );
    }

    if (parseInt(noOfTickets, 10) < 0) {
        console.log("Booking Lock Controller : Invalid number of tickets");
        return apiError(res, 400, "invalid no. of tickets");
    }

    const bookingDate = convertToISODate(req.body.bookingDate);
    if (bookingDate === null) {
        console.log("Booking Lock Controller : Invalid booking date");
        return apiError(res, 400, "invalid booking date");
    }

    const userData: IUser | null = await UserModel.findOne({ _id: userId });
    if (!userData) {
        return apiError(res, 404, "user not found");
    }

    const locationData = await LocationModel.findOne({ _id: locationId });
    if (!locationData || !userData) {
        console.log("Booking Lock Controller : Location/user data not found");
        return apiError(res, 400, "invalid location or userId");
    }

    const locationAvailabilityData = await AvailabilityModel.findOne({
        locationId: locationId,
    });
    if (!locationAvailabilityData) {
        console.log("Location availability data not found");
        return apiError(res, 404, "location availability not found");
    }

    console.log("Booking Lock Controller : Availability data found");
    let isAvailable = false;
    const availabilityData = locationAvailabilityData.calendarMonths;

    for (let i = 0; i < availabilityData.length && !isAvailable; i += 1) {
        /** Month will have the object where "days" key is an array of dates */
        const month = availabilityData[i];
        /** If the month of booking request date is equal to the current month object */
        if (month.month == bookingDate.getMonth() + 1) {
            for (let j = 0; j < month.days.length; j += 1) {
                const currentDate = new Date(
                    month.days[j].calendarDate
                ).getDate();

                if (currentDate === bookingDate.getDate()) {
                    if (month.days[j].availableTickets < noOfTickets) {
                        console.log(
                            "Booking Lock Controller : Reqested tickets count not available"
                        );
                        return apiError(res, 400, "tickets not available");
                    }
                    isAvailable = true;
                    month.days[j].availableTickets -= noOfTickets;
                    break;
                }
            }
        }
    }

    // TODO: check what this does ? similar return statement above!!
    if (!isAvailable) {
        return apiError(res, 404, "not enough tickets available");
    }

    await locationAvailabilityData.save();

    /** Generate a temporary booking id */
    const tempBookingId = uuidv4();

    /** Calculate the booking price */
    const bookingPrice = noOfTickets * locationData.ticketPrice;

    /** Creating location address oject to save with lock booking data */
    const locationAddress = {
        address: locationData.address,
        country: locationData.country,
        state: locationData.state,
        city: locationData.city,
        pincode: locationData.pincode,
    };

    const userName = `${userData.name.firstName} ${userData.name.lastName}`;
    const lockBookingSchema: ITempBooking = new TempBookingModel({
        lockId: tempBookingId,
        locationId: locationId,
        locationName: locationData.name,
        locationDesc: locationData.description,
        locationAddress: locationAddress,

        userId: userId,
        userName: userName,
        noOfTickets: noOfTickets,
        bookingPrice: bookingPrice,
        dateOfVisit: bookingDate,
        timeOfExpiry: new Date(Date.now() + 1 * 60 * 1000),
    });

    const lockBookingDataSaveResult = await lockBookingSchema.save();
    if (lockBookingDataSaveResult === null) {
        return apiError(res, 400, "unable to save booking data");
    }

    /** Return detailed response (todo) */
    return apiResponse(res, 200, "booking locked", { lockId: tempBookingId });
};

export { bookingLockController };
