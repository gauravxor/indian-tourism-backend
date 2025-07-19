class NotFoundError extends Error {
    details: any;

    constructor(message: string, details?: any) {
        super(message);
        this.name = "NotFoundError";
        this.details = details;
    }
}

export { NotFoundError };
