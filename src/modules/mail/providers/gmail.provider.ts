import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { EmailProvider } from '../interfaces/email-provider.interface';
import { OtpTemplate } from '../templates/otp.template';

@Injectable()
export class GmailProvider implements EmailProvider {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }

    async sendOtpEmail(to: string, name: string, otp: string): Promise<void> {
        const subject = OtpTemplate.subject;
        const html = OtpTemplate.html({ name, otp });

        await this.transporter.sendMail({
            from: `"Yatra" <${process.env.GMAIL_USER!}>`,
            to,
            subject,
            html,
        });
    }
}
