const BookingsModel = require('../../models/bookingsModel');

const getBookingDetailsController = async (req, res) => {
    const bookingId = req.body.bookingId;

    const bookingData = await BookingsModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            message: 'No bookings found with the provided ID',
        });
    }
    /** If no booking details were found */
    return res.status(200).json({
        status: 'success',
        message: 'Booking details',
        data: bookingData,
    });
};
module.exports = getBookingDetailsController;
