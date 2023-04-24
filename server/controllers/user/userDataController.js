const UserModel = require("../../models/userModel");
const BookingsModel = require("../../models/bookingsModel");

const _ = require("lodash");

const getUserDataController = async (req, res) => {

	const userId = (req.params.userId).toString();
	console.log(userId);
	if(userId === undefined || userId === null || userId === ""){
		return res.status(400).json({
			status: "failure",
			message: "User Id is required"
		});
	}

	const userData = await UserModel.findOne({_id: userId});
	if(userData === null){

		return res.status(400).json({
			status: "failure",
			message: "User not found"
		});
	}
	else{
		return res.status(200).json({
			status: "success",
			message: "User data fetched successfully",
			userData
		});
	}
}

/** GET USER BOOKINGS CONRTROLLER CODE */

async function getIndividualBookingData(bookingId)
{
	console.log("Passed booking id is = > " + bookingId);
	const bookingData = await BookingsModel.findOne({ bookingId: bookingId });
	if(bookingData === null) {
		console.log("INTERNAL : No bookings found with the provided ID");
		return null;
	}
	else{
		console.log(bookingData);
		return bookingData;
	}
}


const getUserBookingsController = async (req, res) => {

	const userId = (req.params.userId).toString();
	console.log(userId);
	if(userId === undefined || userId === null || userId === ""){
		return res.status(400).json({
			status: "failure",
			message: "User Id is required"
		});
	}

	const userData = await UserModel.findOne({_id: userId});
	if(userData === null){

		return res.status(400).json({
			status: "failure",
			message: "User not found"
		});
	}
	else{

		const userBookings = [];
		const bookingIds = userData.bookings;
		const userBookingCount = userData.bookingCount;

		console.log("THe booking count is = " + userBookingCount);
		console.log("The booking id is = " + bookingIds);
		for(const bookingObject of bookingIds){
			const bookingData = await getIndividualBookingData((bookingObject.bookingId).toString());
			if(bookingData !== null){
				userBookings.push(bookingData);
			}
		}

		return res.status(200).json({
			status: "success",
			message: "User bookings fetched successfully",
			userBookings,
		});
	}
}



module.exports = {
	getUserDataController,
	getUserBookingsController
}
