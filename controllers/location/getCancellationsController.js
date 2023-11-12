const CancellationModel = require('../../models/cancellationModel');

const getCancellationsController = async (req, res) => {
    const adminId = req.params.adminId;

    const cancellationData = await CancellationModel.find({
        adminId: adminId,
    });
    if (cancellationData === null) {
        return res.status(400).json({
            status: 'sucess',
            message: 'No cancellations found',
        });
    }

    return res.status(200).json({
        status: 'success',
        message: 'Cancellations found',
        data: cancellationData,
    });
};

module.exports = getCancellationsController;
