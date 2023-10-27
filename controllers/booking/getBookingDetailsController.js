
const BookingsModel = require('../../models/bookingsModel');

const getBookingDetailsController = async (req, res, next) => {

	const bookingId = req.body.bookingId;

	// query the booking model to get the booking details


	const bookingData = await BookingsModel.findOne({ bookingId: bookingId });
	if(bookingData === null) {
		return res.status(400).json({
			status: "failure",
			message: "No bookings found with the provided ID"
		});
	}
	else{
		return res.status(200).json({
			status: "success",
			message: "Booking details",
			data: bookingData
		});
	}
}
module.exports = getBookingDetailsController;