const { v4: uuidv4 } = require('uuid');  // eslint-disable-line
const FIREBASE = require('../../helper/firebaseHelper');

const LocationModel = require('../../models/locationModel');
const AdminModel = require('../../models/adminModel');

const updateLocationController = async (req, res) => {
    /** Stop if request is coming from "local" user */
    if (req.userType !== 'admin') {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                message: 'unauthorized access',
                debugger: 'user is not an administrator',
            },
        });
    }

    /** Store locationId from URL parameter */
    const locationId = req.params.locationId;
    const adminId = req.userId;

    /** Searching if locationId is there in current user i.e. admin's model */
    const adminSearchResult = await AdminModel.findOne({
        _id: adminId,
        'locations.locationId': locationId,
    });

    /** If search fails, then current user is not the creator of the location */
    if (adminSearchResult === null) {
        return res.status(401).json({
            status: 'failure',
            code: 401,
            error: {
                msg: 'unauthorized access',
                details: 'user is not the administrator of the location',
            },
        });
    }

    try {
        const locationData = await LocationModel.findById(locationId);

        if (!locationData) {
            return res.status(404).json({
                status: 'failure',
                code: 404,
                error: {
                    message: 'location not found',
                    details: 'no location data found for the given location id',
                },
            });
        }

        const {
            name, description, address, city, state, country, pincode, capacity, ticketPrice,
        } = req.body;

        const updatedLocation = {
            name: name || locationData.name,
            description: description || locationData.description,
            address: address || locationData.address,
            city: city || locationData.city,
            state: state || locationData.state,
            country: country || locationData.country,
            pincode: pincode || locationData.pincode,
            capacity: capacity || locationData.capacity,
            ticketPrice: ticketPrice || locationData.ticketPrice,
        };

        let images = locationData.images.slice();
        const imageFiles = req.files;
        if (imageFiles && imageFiles.length > 0) {
            console.log(images);
            await Promise.all(req.files.map(async (file) => {
                const { buffer, mimetype } = file;
                const directory = 'images/locations';
                const folderName = locationId;
                let oldFileName = null;
                images = images.filter((image) => {
                    if (image.imageType === file.fieldname) {
                        console.log('Got an old file');
                        oldFileName = image.urls.split('/').pop();
                        return false;
                    }
                    return true;
                });

                const newFilename = `${uuidv4()}.${mimetype.split('/')[1]}`;
                const imageUrl = await FIREBASE.uploadImage(buffer, directory, folderName, oldFileName, newFilename, mimetype);
                images.push({
                    imageType: file.fieldname,
                    urls: imageUrl,
                });
            }));
        }
        console.log(images);
        /** New updated location data object */
        const updatedLocationData = {
            ...updatedLocation,
            images,
            updatedAt: new Date(),
        };

        /** Performing update query in the database */
        const locationUpdateResult = await LocationModel.findByIdAndUpdate(
            locationId,
            updatedLocationData,
            { new: true },
        );

        if (locationUpdateResult === null) {
            return res.status(500).json({
                status: 'failure',
                code: 500,
                error: {
                    message: 'failed to update location',
                    code: 'could not save updated location data in database',
                },
            });
        }

        return res.status(200).json({
            status: 'success',
            code: 200,
            data: {
                message: 'location updated',
                details: 'updated location data saved in database',
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: 'failure',
            code: 500,
            error: {
                message: 'failed to update location',
                code: 'could not save updated location data in database',
            },
        });
    }
};
module.exports = updateLocationController;
