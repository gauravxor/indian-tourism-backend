import express from "express";

import { signUpController } from "@controllers/auth/signupController";
import loginController from "@controllers/auth/loginController";
import { logoutController } from "@controllers/auth/logoutController";
import otpController from "@controllers/auth/otpController";
import {
    changePassword,
    forgotPassword,
} from "@controllers/auth/passwordController";

import { resendOtp } from "@helpers/otpHelper";

const authRoutes = express.Router();
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logoutController);
authRoutes.post("/signup", signUpController);

authRoutes.post("/resend-otp", resendOtp);
authRoutes.post("/verify-otp", otpController);

authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/change-password", changePassword);

export { authRoutes };
