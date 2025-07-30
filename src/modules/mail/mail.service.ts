import { Inject, Injectable, Logger } from '@nestjs/common';

import { EMAIL_PROVIDER, EmailProvider } from './interfaces/email-provider.interface';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        @Inject(EMAIL_PROVIDER)
        private readonly provider: EmailProvider
    ) {}

    async sendOtpEmail(to: string, name: string, otp: string) {
        await this.provider.sendOtpEmail(to, name, otp);
    }
}
