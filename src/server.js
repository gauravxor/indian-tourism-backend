require('module-alias/register');

const mongoose = require('mongoose');

const logger = require('@config/logger');

const app = require('@root/src/app');

/* DATABASE CONNECTION */
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        logger.info('Connected to database');
    })
    .catch((err) => {
        logger.error('Error connecting to database', err);
    });

const otpCleaner = require('@services/otpCleaner');
const lockCleaner = require('@services/bookingLockCleaner');

app.listen(process.env.PORT, () => {
    logger.info(`Server started on port : ${process.env.PORT}.`);
});

/** Invoke bookingLockCleaner in every 5 seconds */
setInterval(lockCleaner, 5 * 1000);

/** Invoke OtpCleaner in every 15 seconds */
setInterval(otpCleaner, 15 * 1000);
