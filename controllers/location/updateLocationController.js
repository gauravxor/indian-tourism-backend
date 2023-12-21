const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

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

        const locationFolderPath = path.join(__dirname, `../../public/images/location/${locationId}`);
        fs.mkdirSync(locationFolderPath, { recursive: true });

        const images = locationData.images.slice();
        const imageFiles = req.files;

        /** If update request contains images for update */
        if (imageFiles && imageFiles.length > 0) {
            /** Processing each file from the files array */
            imageFiles.forEach((file) => {
                const fileExtension = path.extname(file.originalname);
                const newFilename = `${uuidv4()}-${file.fieldname}${fileExtension}`;

                const imageUrl = `/public/images/location/${locationId}/${newFilename}`;
                const filePath = path.join(locationFolderPath, newFilename);

                /** Iterating though the exising image files */
                images.forEach((image, index) => {
                    /** Checking if the image we are updating, already exists */
                    if (image.imageType === file.fieldname) {
                        /** Deleting the existing image file in server */
                        fs.unlinkSync(path.join(__dirname, '../../', image.urls));
                        images.splice(index, 1);
                    }
                });

                /** Pusing the updated image URL in images object */
                images.push({
                    imageType: file.fieldname,
                    urls: imageUrl,
                });

                /** Writing the new image files in the server */
                fs.writeFileSync(filePath, file.buffer);
            });
        }

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
