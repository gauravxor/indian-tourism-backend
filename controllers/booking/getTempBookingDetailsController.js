const LockBookingModel = require('../../models/lockBookingModel');

const getTempBookingDetailsController = async (req, res) => {
    const lockId = req.params.lockId;
    const bookingData = await LockBookingModel.findOne({ lockId: lockId });
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'invalid temporary booking id',
                details: 'no temporary booking details found for the given id',
            },
        });
    }
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'found booking data',
            bookingData,
        },
    });
};
module.exports = getTempBookingDetailsController;
