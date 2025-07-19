class ValidationError extends Error {
    details: any;

    constructor(message: string, details?: any) {
        super(message);
        this.name = "ValidationError";
        this.details = details;
    }
}
export { ValidationError };
