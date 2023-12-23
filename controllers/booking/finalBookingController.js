const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const LockBookingModel = require('../../models/lockBookingModel');
const BookingModel = require('../../models/bookingsModel');
const UserModel = require('../../models/userModel');
const FIREBASE = require('../../helper/firebaseHelper');

const sendQrCode = require('../../helper/bookingHelper');

/**
 * Once the user pays, the user will send the booking id and the payment id to the
 * finalbooking controller which will check the payment id and the booking id and
 * confirm the booking and send a permanent booking id to the user. It will also delete the
 * temporary booking id.
 */
const finalBookingController = async (req, res) => {
    const lockId = req.body.lockId;
    const userId = req.userId;

    const bookingData = await LockBookingModel.findOne({ lockId: lockId });
    if (bookingData === null) {
        res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'invalid booking id',
                details: 'no temporary booking details found for the given id',
            },
        });
    } else {
        const bookingId = uuidv4();

        const bookingSchema = BookingModel({
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

        if (bookingDataSaveResult === null) {
            console.log('Booking Controller : Error saving booking data'.red);
            res.status(400).json({
                status: 'failure',
                code: 400,
                error: {
                    message: 'error saving booking data',
                    details: 'failed to save booking data in database',
                },
            });
        } else {
            console.log('Booking Controller : Booking data saved in DB'.green);
            const userModelUpdateResult = await UserModel.findByIdAndUpdate(req.userId, {
                $push: { bookings: { bookingId: bookingId } },
                $inc: { bookingCount: 1 },
            });

            if (userModelUpdateResult === null) {
                console.log('Booking Controller : Failed to add bookingId in User document'.red);
                return res.status(400).json({
                    status: 'failure',
                    code: 400,
                    error: {
                        message: 'error saving booking data in user model',
                        details: 'failed to save booking data in user model',
                    },
                });
            }
            res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    message: 'booking successful',
                    bookingId: bookingId,
                },
            });

            /** Delete the lock booking data */
            const deleteLockIdResult = await LockBookingModel.deleteOne({ lockId: lockId });
            if (deleteLockIdResult === null) {
                console.log('Booking Controller : Failed to delete LOCK data'.red);
            } else {
                console.log('Booking Controller : LOCK data deleted'.green);
            }

            const qrBuffer = await qrcode.toBuffer(bookingId, {
                version: 5,
                errorCorrectionLevel: 'H',
                margin: 1,
                scale: 10,
            });
            await FIREBASE.uploadImage(qrBuffer, 'qr', null, null, `${bookingId}.png`, 'image/png');

            /** Once QR is generated send send it to user with booking details */
            const sendEmailResult = await sendQrCode(bookingId, req.userEmail, bookingDataSaveResult);
            // TODO: Implement a retry queue for sending confirmation emails
            if (sendEmailResult === true) {
                console.log('Booking Controller : QR code emailed'.green);
            } else {
                console.log('Booking Controller : Failed to send QR code'.red);
            }
        }
    }
};

module.exports = finalBookingController;
