const winston = require('winston');
const path = require('path');

const {
    combine, timestamp, printf, colorize,
} = winston.format;

// eslint-disable-next-line no-shadow
const logFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}] : ${message}`);

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
        logFormat,
    ),
    transports: [
        new winston.transports.File({ filename: path.join('logs', 'application.log') }),
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
                logFormat,
            ),
        }),
    ],
});

module.exports = logger;
