const BookingModel = require('../../models/bookingsModel');
const AdminModel = require('../../models/adminModel');

const scannerFetchController = async (req, res) => {
    const accessKey = req.body.accessKey;
    const bookingId = req.body.bookingId;

    if (accessKey === undefined || accessKey === '') {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'access key not provided',
                details: 'access key is required to fetch booking details',
            },
        });
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (searchResult === null) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'invalid access key',
                details: 'provided access key is invalid',
            },
        });
    }

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'invalid booking id',
                details: 'no booking details found for the given booking id',
            },
        });
    }

    if (bookingData.isVisited === true) {
        return res.status(410).json({
            status: 'failure',
            code: 410,
            error: {
                message: 'booking already visited',
                details: 'qr code already scanned for the given booking id',
            },
        });
    }

    if (bookingData.cancellationStatus === 'na') {
        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'booking details found',
                details: 'booking details fetched from the database',
                bookingData,
            },
        });
    }
    /** If the fetched booking was cancelled */
    return res.status(400).json({
        status: 'failure',
        code: 400,
        error: {
            details: 'ticket was cancelled',
            message: 'cancelled qr code scanned',
        },
    });
};

const scannerAllowController = async (req, res) => {
    const accessKey = req.body.accessKey;
    const bookingId = req.body.bookingId;

    if (accessKey === undefined || accessKey === '') {
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'access key not provided',
                details: 'access key is required to open the ticket scanner',
            },
        });
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (searchResult === null) {
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'invalid access key',
                details: 'provided access key is invalid',
            },
        });
    }

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return res.status(404).json({
            status: 'failure',
            code: 404,
            error: {
                message: 'invalid booking id',
                details: 'no booking details found for the given booking id',
            },
        });
    }

    if (bookingData.isVisited === true) {
        return res.status(410).json({
            status: 'failure',
            code: 410,
            error: {
                message: 'booking already visited',
                details: 'qr code already scanned for the given booking id',
            },
        });
    }

    if (bookingData.cancellationStatus !== 'na') {
        return res.status(410).json({
            status: 'failure',
            code: 410,
            error: {
                message: 'ticket was cancelled',
                details: 'cancelled qr code scanned',
            },
        });
    }

    // isVisited is true only when a valid qr code is scanned
    bookingData.isVisited = true;

    const bookingDataSaveResult = await bookingData.save();
    if (bookingDataSaveResult === null) {
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'failed to update ticket status',
                error: 'failed to update the ticket status in database',
            },
        });
    }

    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'updated booking data',
            details: 'ticket invalidated and updated in the database',
        },
    });
};

const scannerVerifyController = async (req, res) => {
    const accessKey = req.body.accessKey;

    if (accessKey === undefined || accessKey === '') {
        console.log('Scanner controller : Access Key not provided'.red);
        return res.status(400).json({
            status: 'failure',
            code: 400,
            error: {
                message: 'access key not provided',
                details: 'access key is required to open the qr scanner',
            },
        });
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (searchResult === null) {
        console.log('Scanner controller : Invalid access key'.red);
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'invalid access key',
                details: 'provided access key is invalid',
            },
        });
    }

    console.log('Scanner Controller : Access key verified'.green);
    return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
            message: 'access key verified',
            details: 'access key is verified and is valid',
        },
    });
};

module.exports = {
    scannerFetchController,
    scannerAllowController,
    scannerVerifyController,
};
