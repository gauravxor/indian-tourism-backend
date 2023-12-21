const BookingsModel = require('../../models/bookingsModel');

const getBookingDetailsController = async (req, res) => {
    const bookingId = req.body.bookingId;

    const bookingData = await BookingsModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'booking does not exists',
                details: 'no booking details found for the given booking id',
            },
        });
    }
    /** If no booking details were found */
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'received booking details',
            details: 'booking details found for the given booking id',
            bookingData,
        },
    });
};
module.exports = getBookingDetailsController;
