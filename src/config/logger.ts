import path from 'path';

import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}] : ${message}`);

const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }), logFormat),
    transports: [
        new winston.transports.File({
            filename: path.join('logs', 'application.log'),
        }),
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
                logFormat
            ),
        }),
    ],
});

export default logger;
