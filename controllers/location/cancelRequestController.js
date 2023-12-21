const BookingModel = require('../../models/bookingsModel');
const CancellationModel = require('../../models/cancellationModel');
const AdminModel = require('../../models/adminModel');

const cancelRequestController = async (req, res) => {
    const bookingId = req.body.bookingId;
    /** Query the booking model to get the booking details */
    const bookingData = await BookingModel.findOne({ bookingId: bookingId });

    /** If no booking data is found with the given is return apt response */
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'no booking data found',
                details: 'no booking data found with the given booking id',
            },
        });
    }

    /** If booking data is found check if booking can be cancelled */
    const dateToday = new Date();
    const dateOfVisit = bookingData.dateOfVisit;

    /** If the date of visit is less than 3 days from cancellation request date,
     * tickets cannot be cancelled
    */
    const dateDifference = Math.floor(dateOfVisit - dateToday) / 1000;
    console.log(`Date difference = ${dateDifference}`);
    console.log(`Date of visit = ${dateOfVisit}`);
    console.log(`Date today = ${dateToday}`);
    if (dateDifference < 259200) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'tickets cannot be cancelled',
                details: 'tickets cannot be cancelled 3 days before the date of visit',
            },
        });
    }
    /** If we have a valid date difference */
    console.log('Ticket cancellation in progress....');

    /** Getting the admin of the location from location model */
    const adminData = await AdminModel.findOne({ 'locations.locationId': bookingData.locationId });

    /** If no admin data is found for the location, then we are messed :) */
    if (adminData === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'no admin data found',
                details: 'no admin data found for the given location id',
            },
        });
    }

    /** Create a new entry in DB for cancellation data */
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

    /** Save the cancellation data */
    const cancellationDataSaveResult = await cancellationData.save();
    if (cancellationDataSaveResult === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'error saving cancellation data',
                details: 'failed to save cancellation data in database',
            },
        });
    }
    /** If cancellation data is saved successfully, then update the booking model
     * Update the booking model to set isCancelled to "pending"
     */
    bookingData.cancellationStatus = 'pending';
    const bookingDataSaveResult = await bookingData.save();
    /** If couldnot save the booking data */
    if (bookingDataSaveResult === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'error saving booking data',
                details: 'failed to save booking data in database',
            },
        });
    }
    /** If data save was successful */
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'cancellation request submitted',
            details: 'cancellation request send to the admin of the location',
        },
    });
};

module.exports = cancelRequestController;
