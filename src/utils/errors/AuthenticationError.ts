class AuthenticationError extends Error {
    details: any;

    constructor(message: string, details?: any) {
        super(message);
        this.name = "AuthenticationError";
        this.details = details;
    }
}

export { AuthenticationError };
