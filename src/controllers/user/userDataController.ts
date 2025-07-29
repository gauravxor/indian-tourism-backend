import { Request, Response } from 'express';

import { UserModel } from '@models/user';
import { AdminModel } from '@models/admin';
import { BookingModel } from '@models/bookings';
import { apiError, apiResponse } from '@utils/responseHelper';

interface AuthenticatedRequest extends Request {
    userType?: 'local' | 'admin';
}

const getUserDataController = async (req: AuthenticatedRequest, res: Response) => {
    console.log(`User Data Controller : User Type -> ${req.userType}`);
    const userId = req.params.userId?.toString();

    if (!userId) {
        console.log('User data controller : User Id not provided');
        return apiError(res, 400, 'user id not provided');
    }

    let userData;
    if (req.userType === 'local') {
        userData = await UserModel.findById(userId);
    } else if (req.userType === 'admin') {
        userData = await AdminModel.findById(userId);
    }

    if (!userData) {
        console.log('User data controller : User data not found in DB');
        return apiError(res, 404, 'user not found');
    }

    console.log('User data controller : User data found in DBs');
    return apiError(res, 200, 'user data fetched', userData);
};

async function getIndividualBookingData(bookingId: string) {
    console.log(`User Data Controller : Received booking id -> ${bookingId}`);
    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (!bookingData) {
        console.log('User Data Controller : No bookings found with the provided ID');
        return null;
    }
    console.log('User Data Controller : Booking data found for provided ID');
    return bookingData;
}

const getUserBookingsController = async (req: Request, res: Response) => {
    const userId = req.params.userId?.toString();

    if (!userId) {
        return apiError(res, 400, 'user id not provided');
    }

    const userData = await UserModel.findById(userId);
    if (!userData) {
        console.log('User data controller : User data not found in DB');
        return apiError(res, 404, 'user not found');
    }

    console.log('User data controller : User data found in DB');
    const userBookings = [];
    const bookingIds = userData.bookings;

    for (const bookingObject of bookingIds) {
        const bookingData = await getIndividualBookingData(bookingObject.bookingId.toString());
        if (bookingData !== null) {
            // @ts-ignore
            userBookings.push(bookingData);
        }
    }
    return apiResponse(res, 200, 'fetched user bookings', userBookings);
};

export { getUserDataController, getUserBookingsController };
