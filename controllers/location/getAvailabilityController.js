const AvailabilityModel = require('../../models/availabilityModel');

const getAvailabilityController = async (req, res) => {
    const locationId = req.params.locationId;
    const currentMonth = (new Date().getMonth() + 1).toString();
    const currentYear = new Date().getFullYear();

    try {
        const availability = await AvailabilityModel.findOne({ locationId: locationId });
        if (!availability) {
            return res.status(404).json({
                status: 'failure',
                code: 404,
                error: {
                    message: 'availability not found',
                    details: 'no availability data found for the given location id',
                },
            });
        }
        const currentMonthIndex = availability.calendarMonths.findIndex(
            (month) => month.month === currentMonth && month.year === currentYear,
        );
        if (currentMonthIndex === -1) {
            return res.status(404).json({
                status: 'failure',
                code: 404,
                error: {
                    message: 'availability not found',
                    details: 'availability data found but not for the current month',
                },
            });
        }

        const currentMonthData = availability.calendarMonths.slice(currentMonthIndex);
        const result = {
            _id: availability._id,
            location: availability.location,
            calendarMonths: currentMonthData,
        };
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'availability retrieved successfully',
                details: 'availability data retrieved for the current month',
                availability: result,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'error retrieving availability',
                details: 'faild the retrieve availability data from the database',
            },
        });
    }
};

module.exports = getAvailabilityController;
