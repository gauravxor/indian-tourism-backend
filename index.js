import 'module-alias/register';

import { connect } from 'mongoose';

import { info, error } from '@config/logger';

import { listen } from '@root/src/app';

import otpCleaner from '@services/otpCleaner';
import lockCleaner from '@services/bookingLockCleaner';

/* DATABASE CONNECTION */
connect(process.env.DATABASE_URL)
    .then(() => {
        info('Connected to database');
    })
    .catch((err) => {
        error('Error connecting to database', err);
    });

listen(process.env.PORT, () => {
    info(`Server started on port : ${process.env.PORT}.`);
});

/** Invoke bookingLockCleaner in every 5 seconds */
setInterval(lockCleaner, 5 * 1000);

/** Invoke OtpCleaner in every 15 seconds */
setInterval(otpCleaner, 15 * 1000);
