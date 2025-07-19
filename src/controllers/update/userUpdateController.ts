import { Request, Response } from "express";
import { UserModel } from "@models/user";
import { AdminModel } from "@models/admin";
import { v4 as uuidv4 } from "uuid";
import UserRepository from "@root/src/database/repositories/UserRepository";
import AdminRepository from "@root/src/database/repositories/AdminRepository";

import { generateAccessToken, generateRefreshToken } from "@helpers/jwtHelper";
import uploadImage from "@helpers/firebaseHelper";

interface AuthenticatedRequest extends Request {
    userId?: string;
    userType?: "local" | "admin";
    file?: Express.Multer.File;
}

const userUpdateController = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            status: "failure",
            code: 400,
            error: {
                message: "Missing userId",
                details: "User ID not provided in request",
            },
        });
    }

    let oldUserData;
    if (req.userType === "local") {
        oldUserData = await UserRepository.searchUserById(userId);
    } else {
        oldUserData = await AdminRepository.searchAdminById(userId);
    }

    if (!oldUserData) {
        return res.status(404).json({
            status: "failure",
            code: 404,
            error: {
                message: "User not found",
                details: "User with the provided ID does not exist",
            },
        });
    }

    let newImageUrl: string | void = oldUserData.userImageURL;

    if (req.file) {
        const { buffer, mimetype } = req.file;
        const directory = "images/users";
        const oldFileName = oldUserData.userImageURL
            ? oldUserData.userImageURL.split("/").pop()
            : "";
        const newFileName = `${uuidv4()}.${mimetype.split("/")[1]}`;
        const folderName = oldUserData._id.toString();

        newImageUrl = await uploadImage(
            buffer,
            directory,
            folderName,
            oldFileName as string,
            newFileName,
            mimetype
        );
    }

    const updatedUserData: any = {
        userImageURL: newImageUrl,
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        },
        contact: {
            email: req.body.email,
        },
        address: {
            country: req.body.country,
        },
        updatedAt: new Date(),
    };

    if (req.body.phone) updatedUserData.contact.phone = req.body.phone;
    if (req.body.dob) updatedUserData.dob = new Date(req.body.dob);
    if (req.body.addressMain)
        updatedUserData.address.addressMain = req.body.addressMain;
    if (req.body.state) updatedUserData.address.state = req.body.state;
    if (req.body.city) updatedUserData.address.city = req.body.city;
    if (req.body.pincode) updatedUserData.address.pincode = req.body.pincode;

    let saveUserResult;
    if (req.userType === "local") {
        saveUserResult = await UserModel.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true }
        );
    } else {
        saveUserResult = await AdminModel.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true }
        );
    }

    if (!saveUserResult) {
        console.log("User Update Controller: Failed to update user data");
        return res.status(500).json({
            status: "failure",
            code: 500,
            error: {
                message: "User data not updated",
                details: "Failed to update the DB data",
            },
        });
    }

    console.log("User Update Controller: User data updated");

    const isEmailUpdated = oldUserData.contact.email !== req.body.email;
    const accessToken = isEmailUpdated
        ? generateAccessToken(userId, req.body.email, req.userType as string)
        : null;
    const refreshToken = isEmailUpdated
        ? generateRefreshToken(userId, req.body.email, req.userType as string)
        : null;

    if (accessToken) {
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
    }

    return res.status(200).json({
        status: "success",
        code: 200,
        data: {
            message: "User data updated",
            ...(refreshToken && { refreshToken }),
        },
    });
};

export { userUpdateController };
