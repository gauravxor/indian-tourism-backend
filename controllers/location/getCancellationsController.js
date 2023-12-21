const CancellationModel = require('../../models/cancellationModel');

const getCancellationsController = async (req, res) => {
    const adminId = req.params.adminId;

    const cancellationData = await CancellationModel.find({
        adminId: adminId,
    });
    if (cancellationData === null) {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            data: {
                message: 'no cancellations found',
                details: 'no cancellations found for the given admin id',
            },
        });
    }

    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'cancellations found',
            details: 'cancellations found for the given admin id',
            cancellationData,
        },
    });
};

module.exports = getCancellationsController;
