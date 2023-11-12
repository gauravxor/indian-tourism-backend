const fs = require('fs');
const path = require('path');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const LocationModel = require('../../models/locationModel');
const AdminModel = require('../../models/adminModel');

const updateLocationController = async (req, res) => {
    /** Stop if request is coming from "local" user */
    if (req.userType !== 'admin') {
        return res.status(401).json({
            status: 'failure',
            msg: 'You are not authorized to perform this action',
        });
    }

    /** Store locationId from URL parameter */
    const locationId = req.params.locationId;
    const adminId = req.userId;

    /** Searching if locationId is there in current user i.e. admin's model */
    const adminSearchResult = await AdminModel.findOne({
        _id: adminId,
        'locations.locationId': locationId
    });

    /** If search fails, then current user is not the creator of the location */
    if (adminSearchResult === null) {
        return res.status(401).json({
            status: 'failure',
            msg: 'You are not the admin of this location',
        });
    }

    try {
        const locationData = await LocationModel.findById(locationId);

        if (!locationData) {
            return res.status(404).json({
                status: 'failure',
                message: 'Location not found',
            });
        }

        const { name, description, address, city, state, country, pincode, capacity, ticketPrice } = req.body;

        const updatedLocation = {
            name: name || locationData.name,
            description: description || locationData.description,
            address: address || locationData.address,
            city: city || locationData.city,
            state: state || locationData.state,
            country: country || locationData.country,
            pincode: pincode || locationData.pincode,
            capacity: capacity || locationData.capacity,
            ticketPrice: ticketPrice || locationData.ticketPrice
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
                message: 'Error updating location',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Location updated successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'failure',
            message: 'Error updating location',
        });
    }
};
module.exports = updateLocationController;
