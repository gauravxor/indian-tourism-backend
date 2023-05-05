const qrcode = require('qrcode');
const {v4: uuidv4} = require('uuid');
const LockBookingModel = require('../../models/lockBookingModel');
const BookingModel = require('../../models/bookingsModel');
const UserModel  = require('../../models/userModel');
const fs = require('fs');
const path = require('path');

const sendQrCode = require('../../helper/bookingHelper');

//Once the user pays, the user will send the booking id and the payment id to the
// finalbooking controller which will check the payment id and the booking id and
// confirm the booking and send a permanent booking id to the user. It will also delete the
// temporary booking id.
const finalBookingController = async (req, res, next) => {

	const lockId = req.body.lockId;
	const paymentId = req.body.paymentId;
	const userId = req.userId;

	// check the payment Id for payment status
	// if payment is successful, then create a permanent booking id
	// and send it to the user. Also delete the temp booking id (lockId)

	// validate the payment id
	// isPaymentDone(paymentId)

	const bookingData = await LockBookingModel.findOne({ lockId: lockId });
	if(bookingData === null) {
		res.status(400).json({
			status: "failure",
			message: "Invalid booking id"
		});
	}
	else{
		const bookingId = uuidv4();

		const bookingSchema = BookingModel({
			bookingId: bookingId,
			locationId: bookingData.locationId,
			locationName: bookingData.locationName,
			locationDesc: bookingData.locationDesc,
			locationAddress: bookingData.locationAddress,

			userId : userId,
			userName: bookingData.userName,
			dateOfVisit: bookingData.dateOfVisit,
			noOfTickets: bookingData.noOfTickets,
			bookingPrice: bookingData.bookingPrice,
			timeOfBooking: new Date()
		});

		const bookingDataSaveResult = await bookingSchema.save();

		if(bookingDataSaveResult === null) {
			console.log("Error dsaving booking data".red);
			res.status(400).json({
				status: "failure",
				message: "Error saving booking data"
			});
		}
		else{
			console.log("Booking Controller : Booking data saved in DB".green);

			const userModelUpdateResult  = await UserModel.findByIdAndUpdate(req.userId, {
				$push: { bookings: { bookingId: bookingId } },
				$inc: { bookingCount: 1 }
			});

			if(userModelUpdateResult === null) {
				console.log("Booking Controller : Failed to save booking data in User document".red);
				return res.status(400).json({
					status: "failure",
					message: "Error saving booking data in user model"
				});
			}
			res.status(200).json({
				status: "success",
				message: "Booking successful",
				bookingId: bookingId
			});

			/** Delete the lock booking data */
			const deleteLockIdResult = await LockBookingModel.deleteOne({ lockId: lockId });
			if(deleteLockIdResult === null) {
				console.log("Booking Controller : Failed to delete LOCK data".red);
			}
			else{
				console.log("Booking Controller : LOCK data deleted".green);
			}

			/**  Checking if ./public/qr folder exists or not if not then create one */
			const qrFolder = './public/qr';
			if(!fs.existsSync(qrFolder)) {
				fs.mkdirSync(qrFolder);
			}

			/** Generate the qr for the booking id and send that qr to user email id */
			const qrFile = './public/qr/'+bookingId+'.png';
			const qrResult = await qrcode.toFile(qrFile, bookingId, {
				version: 5,
				errorCorrectionLevel: 'H',
				margin: 1,
				scale: 10
			});

			if(qrResult === null) {
				console.log("Booking Controller : Error generating the QR code".red);
			}
			else{
				console.log("Booking Controller :  QR code generated for ticket".green);

				/** Once QR is generated send send it to user with booking details */
				while(true) {
					const sendEmailResult = await sendQrCode(bookingId, req.userEmail);
					if(sendEmailResult === true) {
						console.log("Booking Controller : QR code emailed".green);
						break;
					}
					else{
						console.log("Booking Controller : Failed to send QR code".red);
					}
				}
			}
		}
	}
}

module.exports = finalBookingController;