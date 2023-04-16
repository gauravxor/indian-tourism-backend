const LocationModel = require('../../models/locationModel');
const AvailabilityModel = require('../../models/availabilityModel');
const LockBookingModel = require('../../models/lockBookingModel');

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


// this will check the booking reuest and validate for available capacity
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
			message: "Invalid request"
		});
	}

	if(parseInt(noOfTickets) < 0 ) {
		return res
		.status(400)
		.json({
			message: "Invalid number of tickets"
		});
	}

	const bookingDate = convertToISODate(req.body.bookingDate);
	if(bookingDate === null) {
		return res
		.status(400)
		.json({
			message: "Invalid date"
		});
	}

	const locationData = await LocationModel.findOne({ _id: locationId });
	if(locationData === null) {
		return res.
		status(400).
		json({
			message: 'Location not found'
		});
	}
	else {
		console.log("The name of the location is " + locationData.name);

		const locationAvailabilityData = await AvailabilityModel.findOne(
			{
				locationId: locationId,
				'calendarMonths.days.calendarDate': bookingDate
			},
			{ 'calendarMonths.$': 1 }
		);

		if(locationAvailabilityData === null){
			console.log("Availability data was not found".red);
			return res.status(400).json({
				message: "Location was found but no availability data was found"
			});
		}
		else
		{
			console.log("Availability data was found".yellow);
			const monthData = locationAvailabilityData.calendarMonths[0];
			const day = monthData.days.find(date => date.calendarDate.getTime() === bookingDate.getTime());

			if(day.availableTickets < noOfTickets) {
				return res.status(400).json({
					message: "Not enough tickets available"
				});
			}
			else{

				day.availableTickets -= noOfTickets;
				await locationAvailabilityData.updateOne({ calendarMonths: monthData });

				// generate a temporary booking id
				const tempBookingId = uuidv4();

				// calculate the  booking price
				const bookingPrice = noOfTickets * locationData.ticketPrice;

				// save the booking id in the lockBookingModel
				const lockBookingSchema = LockBookingModel({
					lockId: tempBookingId,
					locationId: locationId,
					userId: userId,
					noOfTickets: noOfTickets,
					bookingPrice: bookingPrice,
					dateOfVisit: bookingDate,
					timeOfExpiry: new Date(Date.now() + 15 * 60 * 1000)
				});

				const lockBookingDataSaveResult = await lockBookingSchema.save();
				if(lockBookingDataSaveResult === null) {
					return res.status(400).json({
						message: "Unable to save booking data"
					});
				}

				// return detailed response (todo)
				return res.status(200).json({
					message: "Booking lock successful",
					lockId: tempBookingId
				});
			}
		}
	}
}

module.exports = bookingLockController;