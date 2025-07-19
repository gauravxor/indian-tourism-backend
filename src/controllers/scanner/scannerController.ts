import { BookingModel } from "@models/bookings";
import { AdminModel } from "@models/admin";
import { Request, Response } from "express";
import { apiError, apiResponse } from "@utils/responseHelper";

const scannerFetchController = async (req: Request, res: Response) => {
    const accessKey = req.body.accessKey;
    const bookingId = req.body.bookingId;

    if (!accessKey) {
        return apiError(res, 400, "access key not provided");
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (!searchResult) {
        return apiError(res, 401, "invalid access key");
    }

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (!bookingData) {
        return apiError(res, 404, "booking not found");
    }

    if (bookingData.isVisited === true) {
        return apiError(res, 410, "booking already visited");
    }

    if (bookingData.cancellationStatus === "na") {
        return apiResponse(res, 200, "booking found", bookingData);
    }

    /** If the fetched booking was cancelled */
    return apiError(res, 400, "booking was cancelled");
};

const scannerAllowController = async (req: Request, res: Response) => {
    const accessKey = req.body.accessKey;
    const bookingId = req.body.bookingId;

    if (!accessKey) {
        return apiError(res, 400, "access key not provided");
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (!searchResult) {
        return apiError(res, 404, "invalid access key");
    }

    const bookingData = await BookingModel.findOne({ bookingId: bookingId });
    if (bookingData === null) {
        return apiError(res, 404, "invalid booking id");
    }

    if (bookingData.isVisited) {
        return apiError(res, 410, "booking already visisted");
    }

    if (bookingData.cancellationStatus !== "na") {
        return apiError(res, 410, "booking was cancelled");
    }

    // isVisited is true only when a valid qr code is scanned
    bookingData.isVisited = true;

    const bookingDataSaveResult = await bookingData.save();
    if (!bookingDataSaveResult) {
        return apiError(res, 500, "failed to update ticket status");
    }

    return apiResponse(res, 200, "updated booking data");
};

const scannerVerifyController = async (req: Request, res: Response) => {
    const accessKey = req.body.accessKey;

    if (!accessKey) {
        console.log("Scanner controller : Access Key not provided");
        return apiError(res, 400, "access key not provided");
    }

    const searchResult = await AdminModel.findOne({ accessKey: accessKey });
    if (!searchResult) {
        console.log("Scanner controller : Invalid access key");
        return apiError(res, 401, "invalid access key");
    }

    console.log("Scanner Controller : Access key verified");
    return apiResponse(res, 200, "access key verified");
};

export {
    scannerFetchController,
    scannerAllowController,
    scannerVerifyController,
};
