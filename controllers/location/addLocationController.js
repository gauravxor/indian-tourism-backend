const { v4: uuidv4 } = require('uuid'); // eslint-disable-line
const FIREBASE = require('../../helper/firebaseHelper');

const LocationModel = require('../../models/locationModel');
const AvailabilityModel = require('../../models/availabilityModel');
const AdminModel = require('../../models/adminModel');

const generateDaysArray = (year, month, capacity) => {
    const numDays = new Date(year, month, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= numDays; i += 1) {
        daysArray.push({
            calendarDate: new Date(year, month - 1, i),
            availableTickets: capacity,
        });
    }
    return daysArray;
};

const addLocationController = async (req, res) => {
    console.log(req.userType);
    if (req.userType !== 'admin') {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'unauthorized access',
                details: 'only admins can add locations',
            },
        });
    }

    const {
        name, description, address, city, state, country, pincode, capacity, ticketPrice,
    } = req.body;
    const newLocation = await LocationModel.create({
        name, description, address, city, state, country, pincode, capacity, ticketPrice,
    });
    const locationId = newLocation._id.toString();

    const images = [];
    await Promise.all(req.files.map(async (file) => {
        const { buffer, mimetype } = file;
        const directory = 'images/locations';
        const folderName = locationId;
        const oldFileName = null;
        const newFilename = `${uuidv4()}.${mimetype.split('/')[1]}`;
        const imageUrl = await FIREBASE.uploadImage(buffer, directory, folderName, oldFileName, newFilename, mimetype);
        images.push({
            imageType: file.fieldname,
            urls: imageUrl,
        });
    }));

    // Get current year and month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Create month schemas for remaining months in current year
    const monthsArray = [];
    for (let i = currentMonth; i <= 12; i += 1) {
        monthsArray.push({
            month: i.toString(),
            year: currentYear,
            days: generateDaysArray(currentYear, i, capacity),
        });
    }

    // Create availability entry with default values
    const availabilityEntry = await AvailabilityModel.create({
        locationId: locationId,
        maxCapacity: capacity,
        calendarMonths: monthsArray,
    });

    if (availabilityEntry !== null) {
        const imageAddResult = await LocationModel.findByIdAndUpdate(locationId, {
            $set: { images: images },
        });
        if (imageAddResult !== null) {
            // if images are added successfully, then add location to admin locations array
            const adminAddResult = await AdminModel.findByIdAndUpdate(req.userId, {
                $push: { locations: { locationId: locationId } },
                $inc: { locationCount: 1 },
            });
            if (adminAddResult === null) {
                return res.status(500).json({
                    status: 'failure',
                    code: 500,
                    error: {
                        message: 'failed to save location data',
                        details: 'could not save location data in the database',
                    },
                });
            }
            return res.status(200).json({
                status: 'success',
                code: 200,
                data: {
                    message: 'location added successfully',
                    details: 'location data saved in the database',
                    locationId,
                },
            });
        }
        /** If image was not added */
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'failed to save location data',
                details: 'could not save location data in the database',
            },
        });
    }
    return res.status(500).json({
        status: 'failure',
        code: 500,
        error: {
            message: 'failed to save location data',
            details: 'could not save location data in the database',
        },
    });
};

module.exports = addLocationController;
