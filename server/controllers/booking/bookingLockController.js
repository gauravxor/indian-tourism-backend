const LocationModel = require('../../models/locationModel');
const AvailabilityModel = require('../../models/availabilityModel');
const LockBookingModel = require('../../models/lockBookingModel');
const UserModel = require('../../models/userModel');

const color = require('colors');
const { v4: uuidv4 } = require('uuid');

function convertToISODate(dateString) {
	const dateParts = dateString.split("-");
	const day = dateParts[0];
	const month = dateParts[1] - 1;
	const year = dateParts[2];

	const maxDays = [31, 28,31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if(year % 4 === 0)
		maxDays[1] = 29;

	if(day < 1 || day > maxDays[month]) return null;
	if(month < 0 || month > 11) return null;
	if(year < 0 || year > 2025) return null;

	const dateObject = new Date(year, month, day);
	const bookingDateISO = new Date(dateObject);
	return bookingDateISO;
}


// this will check the booking request and validate for available capacity
// if we have the capacity, it will decrease it but no of tickets and generate a
// temporary booking id and return it to the user. The user will use it to pay.
const bookingLockController = async (req, res, next) => {

	const locationId = req.body.locationId;
	const userId = req.userId;
	const noOfTickets = req.body.noOfTickets;

	console.log("User id from middleware = " + userId);
	if(locationId === undefined || userId === undefined || noOfTickets === undefined) {
		return res
		.status(400)
		.json({
			status: "failure",
			message: "Invalid request"
		});
	}

	if(parseInt(noOfTickets) < 0 ) {
		return res
		.status(400)
		.json({
			status: "failure",
			message: "Invalid number of tickets"
		});
	}

	const bookingDate = convertToISODate(req.body.bookingDate);
	if(bookingDate === null) {
		return res
		.status(400)
		.json({
			status: "failure",
			message: "Invalid date"
		});
	}

	const userData = await UserModel.findOne({ _id: userId });
	const locationData = await LocationModel.findOne({ _id: locationId });
	if(locationData === null || userData === null) {
		return res.
		status(400).
		json({
			status: "failure",
			message: 'Location/ user not found'
		});
	}
	else {

		const locationAvailabilityData = await AvailabilityModel.findOne( {locationId: locationId});
		if(locationAvailabilityData === null){
			console.log("Lock Controller : Location availability data does not exist".red);
			return res.status(400).json({
				status: "failure",
				message: "Location was found but no availability data was found"
			});
		}
		else
		{
			console.log("Lock Controller : Availability data found".yellow);

			var isAvailable = false;
			const availabilityData = locationAvailabilityData.calendarMonths;

			for (var i = 0; i < availabilityData.length && !isAvailable; i++) {

				/** Month will have the object where "days" key is an array of dates */
				const month = availabilityData[i];
				/** If the month of booking request date is equal to the current month object */
				if(month.month == bookingDate.getMonth() + 1){

					for (var j = 0; j < month.days.length; j++) {

						const currentDate = new Date(month.days[j].calendarDate).getDate();

						if(currentDate === bookingDate.getDate()){
							if(month.days[j].availableTickets < noOfTickets){
								return res.status(400).json({
									"status": "failure",
									message: "Not enough tickets available"
								});
							}
							else{
								isAvailable = true;
								month.days[j].availableTickets -= noOfTickets;
								break;
							}
						}
					}
				}
			}


			if(!isAvailable) {
				return res.status(400).json({
					"status": "failure",
					message: "Not enough tickets available"
				});
			}
			else{

				await locationAvailabilityData.save();

				// generate a temporary booking id
				const tempBookingId = uuidv4();


				// calculate the  booking price
				const bookingPrice = noOfTickets * locationData.ticketPrice;


				// creating location address oject to save with lock booking data
				const locationAddress = {
					address: locationData.address,
					country: locationData.country,
					state: locationData.state,
					city : locationData.city,
					pincode: locationData.pincode
				}

				const userName = userData.name.firstName +  " " + userData.name.middleName + userData.name.lastName;
				const lockBookingSchema = LockBookingModel({
					lockId: tempBookingId,
					locationId: locationId,
					locationName: locationData.name,
					locationDesc: locationData.description,
					locationAddress: locationAddress,

					userId: userId,
					userName: userName,
					noOfTickets: noOfTickets,
					bookingPrice: bookingPrice,
					dateOfVisit: bookingDate,
					timeOfExpiry: new Date(Date.now() + 15 * 60 * 1000)
				});

				const lockBookingDataSaveResult = await lockBookingSchema.save();
				if(lockBookingDataSaveResult === null) {
					return res.status(400).json({
						status: "failure",
						message: "Unable to save booking data"
					});
				}

				// return detailed response (todo)
				return res.status(200).json({
					status: "success",
					message: "Booking lock successful",
					lockId: tempBookingId
				});
			}
		}
	}
}

module.exports = bookingLockController;