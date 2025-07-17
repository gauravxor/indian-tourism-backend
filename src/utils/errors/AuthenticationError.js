class AuthenticationError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'AuthenticationError';
        this.details = details;
    }
}

module.exports = AuthenticationError;
