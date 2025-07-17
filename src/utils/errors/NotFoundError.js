class NotFoundError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'NotFoundError';
        this.details = details;
    }
}

module.exports = NotFoundError;
