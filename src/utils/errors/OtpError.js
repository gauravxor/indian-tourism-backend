class OtpError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'OtpError';
        this.details = details;
    }
}

module.exports = OtpError;
