import { v4 as uuidv4 } from "uuid"; // eslint-disable-line
import uploadImage from "@helpers/firebaseHelper";

import { LocationModel, ILocation } from "@models/location";
import { AvailabilityModel } from "@models/availability";
import { AdminModel } from "@models/admin";
import { Request, Response } from "express";
import { apiError, apiResponse } from "@utils/responseHelper";
import logger from "@config/logger";

interface FileUploadRequest extends Request {
    files: Express.Multer.File[];
    userType: string;
    userId: string;
}

const generateDaysArray = (year: number, month: number, capacity: number) => {
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

const addLocationController = async (req: FileUploadRequest, res: Response) => {
    console.log(req.userType);
    if (req.userType !== "admin") {
        return apiError(res, 401, "requst unauthorized");
    }

    const newLocation: ILocation = await LocationModel.create(req.body);

    const locationId = newLocation._id.toString();

    const images = [];

    for (const file of req.files) {
        const { buffer, mimetype, fieldname } = file;
        const directory = "images/locations";
        const folderName = locationId;
        const oldFileName = null;
        const newFilename = `${uuidv4()}.${mimetype.split("/")[1]}`;

        const imageUrl = await uploadImage(
            buffer,
            directory,
            folderName,
            oldFileName,
            newFilename,
            mimetype
        );

        images.push({
            imageType: fieldname,
            urls: imageUrl,
        });
    }
    const { capacity } = req.body;
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
        const imageAddResult = await LocationModel.findByIdAndUpdate(
            locationId,
            {
                $set: { images: images },
            }
        );
        if (imageAddResult !== null) {
            // if images are added successfully, then add location to admin locations array
            const adminAddResult = await AdminModel.findByIdAndUpdate(
                req.userId,
                {
                    $push: { locations: { locationId: locationId } },
                    $inc: { locationCount: 1 },
                }
            );
            if (!adminAddResult) {
                logger.error("Failed to save location data in DB");
                return apiError(res, 500, "internal server error");
            }

            return apiResponse(res, 200, "location added", locationId);
        }

        /** If image was not added */
        return apiError(res, 500, "failed to save location data");
    }

    return apiError(res, 500, "failed to save location data");
};

export { addLocationController };
