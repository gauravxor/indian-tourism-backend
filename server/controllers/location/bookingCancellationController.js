const CancellationModel = require('../../models/cancellationModel');
const BookingModel = require('../../models/bookingsModel');
const UserModel = require('../../models/userModel');
const AvailabilityModel = require('../../models/availabilityModel');
const color = require('colors');

const bookingCancellationController = async(req, res, next) => {

	const bookingId = req.body.bookingId;
	const adminId = req.body.adminId;

	/** Query the cancellation model to find the cancellation data */
	const cancellationData = await CancellationModel.findOne({ bookingId: bookingId, adminId: adminId });

	/** If no cancellation data is found then the ticket was never cancelled or cancellatino is already approved */
	if(cancellationData === null) {
		return res.status(400).json({
			status: "failure",
			message: "No cancellations found with the provided ID"
		});
	}
	else{

		console.log("Cancellation data found");
		console.log(cancellationData);

		/** Update the bookingModel's cancellation status to "approved" */
		const bookingUpdateResult = await BookingModel.updateOne(
			{ bookingId: bookingId },
			{ cancellationStatus: "approved" }
		);

		if(bookingUpdateResult === null){
			return res.statsus(400).json({
				status: "failure",
				message: "Cannot update the booking model, something went wrong"
			});
		}

		console.log("Booking model updated successfully");

		/** Once the booking status is updated update the user wallet balance*/
		const userWalletUpdateResult = await UserModel.updateOne(
			{_id: cancellationData.userId},
			{
				$inc: {walletBalance: cancellationData.bookingPrice}
			}
		);

		if(userWalletUpdateResult === null){
			return res.status(400).json({
				status: "failure",
				message: "Cannot update the user wallet balance"
			});
		}
		console.log("Cancellation Controller : Wallet Balance Updated".green);

		/** Once the wallet is updated delete the cancellation entry from the cancellation model */
		const cancellationDeleteResult = await CancellationModel.deleteOne({ bookingId: bookingId, adminId: adminId });
		if(cancellationDeleteResult === null){
			console.log("Cannot delete the cancellation entry from the cancellation model");
			return res.status(400).json({
				status: "failure",
				message: "Cannot delete the cancellation entry from the cancellation model"
			})
		}

		/** Now once everything is done, update the availability model */
		const locationAvailabilityData = await AvailabilityModel.findOne( {locationId: cancellationData.locationId});
		if(locationAvailabilityData === null){
			console.log("Lock Controller : Location availability data does not exist".red);
			return res.status(400).json({
				status: "failure",
				message: "Location was found but no availability data was found"
			});
		}

		var isDateFound = false;
		const availabilityData = locationAvailabilityData.calendarMonths;
		const dateOfVisit = cancellationData.dateOfVisit;
		console.log("performing date check".yellow);
		for (var i = 0; i < availabilityData.length && !isDateFound; i++) {

			/** Month will have the object where "days" key is an array of dates */
			const month = availabilityData[i];
			// console.log("Month = " + month);

			/** If the month of booking request date is equal to the current month object */
			console.log(dateOfVisit.getMonth());
			if(month.month == dateOfVisit.getMonth() + 1){

				// console.log("Month found".yellow);
				for (var j = 0; j < month.days.length; j++) {

					const currentDate = new Date(month.days[j].calendarDate).getDate();
					// console.log(currentDate + " - > " + dateOfVisit.getDate());
					if(currentDate === dateOfVisit.getDate()){
						isDateFound = true;
						month.days[j].availableTickets += cancellationData.noOfTickets;
						break;
					}
				}
			}
		}
		const availabilityUpdateResult = await locationAvailabilityData.save();

		if(isDateFound === true){
			return res.status(200).json({
				status: "success",
				message: "Successfully cancelled the booking"
			});
		}
	}
}

module.exports = bookingCancellationController;