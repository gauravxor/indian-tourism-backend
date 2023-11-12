const BookingModel = require('../../models/bookingsModel');
const AdminModel = require('../../models/adminModel');

const scannerFetchController = async (req, res) => {
    const accessKey = req.body.accessKey;
    const bookingId = req.body.bookingId;

    if (accessKey === undefined || accessKey === '') {
        return res.status(400).json({
            status: 'failure',
            message: 'Access key not provided',
        });
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (searchResult === null) {
        return res.status(200).json({
            status: 'failure',
            message: 'Invalid access key',
        });
    }

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid booking id',
        });
    }

    if (bookingData.isVisited === true) {
        return res.status(400).json({
            status: 'failure',
            message: 'Booking already visited',
        });
    }

    if (bookingData.cancellationStatus === 'na') {
        return res.status(200).json({
            status: 'success',
            message: 'Booking details fetched successfully',
            data: bookingData,
        });
    }
    /** If the fetched booking was cancelled */
    return res.status(400).json({
        status: 'failure',
        message: 'Ticket was cancelled',
    });
};

const scannerAllowController = async (req, res) => {
    const accessKey = req.body.accessKey;
    const bookingId = req.body.bookingId;

    if (accessKey === undefined || accessKey === '') {
        return res.status(400).json({
            status: 'failure',
            message: 'Access key not provided',
        });
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (searchResult === null) {
        return res.status(200).json({
            status: 'failure',
            message: 'Invalid access key',
        });
    }

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid booking id',
        });
    }

    if (bookingData.isVisited === true) {
        return res.status(400).json({
            status: 'failure',
            message: 'Booking already visited',
        });
    }

    if (bookingData.cancellationStatus !== 'na') {
        return res.status(400).json({
            status: 'failure',
            message: 'Ticket was cancelled',
        });
    }

    bookingData.isVisited = true;

    const bookingDataSaveResult = await bookingData.save();
    if (bookingDataSaveResult === null) {
        return res.status(500).json({
            status: 'failure',
            msg: 'Failed to update entry in DB',
        });
    }

    return res.status(200).json({
        status: 'success',
        msg: 'Updated booking data',
    });
};

const scannerVerifyController = async (req, res) => {
    const accessKey = req.body.accessKey;

    if (accessKey === undefined || accessKey === '') {
        console.log('Scanner controller : Access Key not provided'.red);
        return res.status(400).json({
            status: 'failure',
            message: 'Access key not provided',
        });
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (searchResult === null) {
        console.log('Scanner controller : Invalid access key'.red);
        return res.status(200).json({
            status: 'failure',
            message: 'Invalid access key',
        });
    }

    console.log('Scanner Controller : Access key verified'.green);
    return res.status(200).json({
        status: 'success',
        message: 'Access key verified',
    });
};

module.exports = {
    scannerFetchController,
    scannerAllowController,
    scannerVerifyController,
};
