class OtpError extends Error {
    details: any;
    constructor(message: string, details?: any) {
        super(message);
        this.name = "OtpError";
        this.details = details;
    }
}

export { OtpError };
