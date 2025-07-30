import { randomBytes } from 'crypto';

export function generateOtp(length: number = 6): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';

    const allChars = upper + lower + digits;
    const charsLength = allChars.length;

    const bytes = randomBytes(length);
    let otp = '';

    for (let i = 0; i < length; i++) {
        const index = bytes[i] % charsLength;
        otp += allChars[index];
    }
    return otp;
}
