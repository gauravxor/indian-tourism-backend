const AvailabilityModel = require('../../models/availabilityModel');

const getAvailabilityController = async (req, res, next) => {

	const locationId = req.params.locationId;
	const currentMonth = (new Date().getMonth() + 1).toString();
	const currentYear = new Date().getFullYear();

	try{
		const availability = await AvailabilityModel.findOne({ locationId: locationId });
		if (!availability) {
			return res.
			status(404).
			json({
				message: 'Availability not found'
			});
		}
		const currentMonthIndex = availability.calendarMonths.findIndex(
			(month) => month.month === currentMonth && month.year === currentYear
		);
		if(currentMonthIndex === -1) {
			return res
			.status(404)
			.json({
				message: 'Availability not found for current month'
			});
		}

		const currentMonthData = availability.calendarMonths.slice(currentMonthIndex);
		const result = {
			_id: availability._id,
			location: availability.location,
			calendarMonths: currentMonthData,
		};
		return res
		.status(200)
		.json({
			message: 'Availability retrieved successfully',
			availability: result
		});
	}
	catch(error) {
		return res
		.status(500).
		json({
			message: 'Error retrieving availability',
			error: error
		});
	}
};

module.exports = getAvailabilityController;
