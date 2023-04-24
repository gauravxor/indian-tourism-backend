const CancellationModel = require('../../models/cancellationModel');
const BookingModel = require('../../models/bookingsModel');
const UserModel = require('../../models/userModel');

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
		else{

			console.log("Booking model updated successfully");
			console.log(bookingUpdateResult);

			/** Once the booking status is updated update the user wallet balance */
			const userWalletUpdateResult = await UserModel.updateOne(
				{_id: cancellationData.userId},
				{$inc: {walletBalance: cancellationData.bookingPrice}}
			);

			if(userWalletUpdateResult === null){
				return res.status(400).json({
					status: "failure",
					message: "Cannot update the user wallet balance"
				});
			}
			else{
				console.log("User wallet balance updated successfully");
				console.log(userWalletUpdateResult);

				/** Once the wallet is updated delete the cancellation entry from the cancellation model */
				const cancellationDeleteResult = await CancellationModel.deleteOne({ bookingId: bookingId, adminId: adminId });
				if(cancellationDeleteResult === null){
					console.log("Cannot delete the cancellation entry from the cancellation model");
					return res.status(400).json({
						status: "failure",
						message: "Cannot delete the cancellation entry from the cancellation model"
					})
				}
				else{
					console.log("Deleted the cancellation data from the cancellation model");
					return res.status(200).json({
						status: "success",
						message: "Successfully cancelled the booking"
					})
				}
			}
		}
	}
}

module.exports = bookingCancellationController;