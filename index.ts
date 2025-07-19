import "module-alias/register";

import { connect } from "mongoose";

import logger from "@config/logger";

import app from "@root/src/app";

import otpCleaner from "@services/otpCleaner";
import lockCleaner from "@services/bookingLockCleaner";

/* DATABASE CONNECTION */
connect(process.env.DATABASE_URL as string)
    .then(() => {
        logger.info("Connected to database");
    })
    .catch((err) => {
        logger.error("Error connecting to database", err);
    });

app.listen(process.env.PORT, () => {
    logger.info(`Server started on port : ${process.env.PORT}.`);
});

/** Invoke bookingLockCleaner in every 5 seconds */
setInterval(lockCleaner, 5 * 1000);

/** Invoke OtpCleaner in every 15 seconds */
setInterval(otpCleaner, 15 * 1000);
