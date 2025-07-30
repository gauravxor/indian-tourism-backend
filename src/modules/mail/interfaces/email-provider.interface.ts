export interface EmailProvider {
    sendOtpEmail(to: string, name: string, otp: string): Promise<void>;
}

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';
