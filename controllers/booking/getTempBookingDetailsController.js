const LockBookingModel = require('../../models/lockBookingModel');

const getTempBookingDetailsController = async (req, res) => {
    const lockId = req.params.lockId;
    const bookingData = await LockBookingModel.findOne({ lockId: lockId });
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid temporary booking id',
        });
    }
    return res.status(200).json({
        status: 'success',
        message: 'Temporary booking details',
        data: bookingData,
    });
};
module.exports = getTempBookingDetailsController;
