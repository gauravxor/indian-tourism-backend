import { v4 as uuidv4 } from "uuid";
import uploadImage from "@helpers/firebaseHelper";

import { LocationModel } from "@root/src/models/location";
import { AdminModel } from "@models/admin";
import { apiResponse, apiError } from "@utils/responseHelper";
import { Request, Response } from "express";
import { AuthenticationRequest } from "@middlewares/tokenware";

const updateLocationController = async (
    req: AuthenticationRequest,
    res: Response
) => {
    /** Stop if request is coming from "local" user */
    if (req.userType !== "admin") {
        return apiError(res, 401, "unauthorized access");
    }

    /** Store locationId from URL parameter */
    const locationId = req.params.locationId;
    const adminId = req.userId;

    /** Searching if locationId is there in current user i.e. admin's model */
    const adminSearchResult = await AdminModel.findOne({
        _id: adminId,
        "locations.locationId": locationId,
    });

    /** If search fails, then current user is not the creator of the location */
    if (!adminSearchResult) {
        return apiError(res, 401, "unauthorized access");
    }

    try {
        const locationData = await LocationModel.findById(locationId);

        if (!locationData) {
            return apiError(res, 404, "location not found");
        }

        const {
            name,
            description,
            address,
            city,
            state,
            country,
            pincode,
            capacity,
            ticketPrice,
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

        // Fix 1: Handle potentially undefined images array
        let images = locationData.images ? locationData.images.slice() : [];

        // Fix 2: Properly type check req.files as Express.Multer.File[]
        const imageFiles = req.files as Express.Multer.File[];

        if (imageFiles && Array.isArray(imageFiles) && imageFiles.length > 0) {
            console.log(images);
            await Promise.all(
                imageFiles.map(async (file: Express.Multer.File) => {
                    const { buffer, mimetype } = file;
                    const directory = "images/locations";
                    const folderName = locationId;
                    let oldFileName: string | null = null;

                    // Fix 3: Handle potentially undefined urls property
                    images = images.filter((image) => {
                        if (image.imageType === file.fieldname) {
                            console.log("Got an old file");
                            // Safe access to urls property
                            if (image.urls) {
                                oldFileName =
                                    image.urls.split("/").pop() || null;
                            }
                            return false;
                        }
                        return true;
                    });

                    const newFilename = `${uuidv4()}.${mimetype.split("/")[1]}`;

                    // Fix 4: Handle potential undefined return from uploadImage
                    const imageUrl = await uploadImage(
                        buffer,
                        directory,
                        folderName,
                        oldFileName,
                        newFilename,
                        mimetype
                    );

                    // Only add if imageUrl is valid
                    if (imageUrl) {
                        images.push({
                            imageType: file.fieldname,
                            urls: imageUrl,
                        });
                    }
                })
            );
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
            { new: true }
        );

        if (locationUpdateResult === null) {
            return apiError(res, 500, "failed to update location");
        }

        return apiResponse(res, 200, "location updated");
    } catch (err) {
        return apiError(res, 500, "failed to update location");
    }
};

export { updateLocationController };
