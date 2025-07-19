import { CancellationModel } from "@models/cancellation";
import { apiResponse, apiError } from "@utils/responseHelper";
import { Request, Response } from "express";

const getCancellationsController = async (req: Request, res: Response) => {
    const adminId = req.params.adminId;

    const cancellationData = await CancellationModel.find({
        adminId: adminId,
    });
    if (!cancellationData) {
        return apiError(res, 404, "no cancellations found");
    }

    return apiResponse(res, 200, "cancellations found", cancellationData);
};

export { getCancellationsController };
