import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { homeRoutes } from "@root/src/routes/home";
import { authRoutes } from "@routes/authRoutes";
import { tokenRoutes } from "@root/src/routes/tokenRoutes";
import { updateRoutes } from "@root/src/routes/updateRoutes";
import { locationRoutes } from "@routes/locationRoutes";
import { bookingRoutes } from "@routes/bookingRoutes";
import { userRoutes } from "@routes/userRoutes";
import { scannerRoutes } from "@routes/scannerRoutes";

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
        origin: [
            "http://192.168.1.1:3000",
            "https://indian-tourism.vercel.app",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);

app.use("/", homeRoutes);
app.use("/public", express.static("public"));
app.use("/api/token", tokenRoutes);
app.use("/api/auth/", authRoutes);
app.use("/api/update/", updateRoutes);
app.use("/api/location/", locationRoutes);
app.use("/api/book/", bookingRoutes);
app.use("/api/user/", userRoutes);
app.use("/scanner", scannerRoutes);

export default app;
