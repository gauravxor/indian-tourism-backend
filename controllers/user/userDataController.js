const UserModel = require('../../models/userModel');
const AdminModel = require('../../models/adminModel');
const BookingsModel = require('../../models/bookingsModel');

const getUserDataController = async (req, res) => {
    console.log('User Data Controller : User Type ->'.yellow + `${req.userType}`.cyan);
    const userId = (req.params.userId).toString();
    console.log('User data controller : User Id -> '.yellow + `${userId}`.cyan);
    if (userId === undefined || userId === null || userId === '') {
        console.log('User data controller : User Id not provided'.red);
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'missing user id',
                details: 'user id required to get user details',
            },
        });
    }

    let userData;
    if (req.userType === 'local') {
        userData = await UserModel.findOne({ _id: userId });
    } else if (req.userType === 'admin') {
        userData = await AdminModel.findOne({ _id: userId });
    }

    if (userData === null) {
        console.log('User data controller : User data not found in DB'.red);
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'user not found',
                details: 'no user exists with requested user id',
            },
        });
    }
    console.log('User data controller : User data found in DB'.green);
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'user data fetched successfully',
            userData,
        },
    });
};

/** Function to get user's bookings */
async function getIndividualBookingData(bookingId) {
    console.log('User Data Controller : Received booking id -> '.yellow + `${bookingId}`.cyan);
    const bookingData = await BookingsModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        console.log('User Data Controller : No bookings found with the provided ID'.red.bold);
        return null;
    }
    console.log('User Data Controller : Booking data found provided ID'.green);
    return bookingData;
}

const getUserBookingsController = async (req, res) => {
    const userId = (req.params.userId).toString();
    console.log('User data controller : User Id -> '.yellow + `${userId}`.cyan);

    if (userId === undefined || userId === null || userId === '') {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'user id not provided',
                details: 'user id is required to get user bookings',
            },
        });
    }

    const userData = await UserModel.findOne({ _id: userId });
    if (userData === null) {
        console.log('User data controller : User data not found in DB'.red);
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'user not found',
                details: 'user data not found for the given user id',
            },
        });
    }

    console.log('User data controller : User data found in DB'.green);
    const userBookings = [];
    const bookingIds = userData.bookings;

    for (const bookingObject of bookingIds) {
        const bookingData = await getIndividualBookingData((bookingObject.bookingId).toString());
        if (bookingData !== null) {
            userBookings.push(bookingData);
        }
    }

    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'fetched user bookings',
            details: 'user bookings books fetched from the database',
            userBookings,
        },
    });
};

module.exports = {
    getUserDataController,
    getUserBookingsController,
};
