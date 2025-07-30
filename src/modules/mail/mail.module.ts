import { Module } from '@nestjs/common';

import { MailService } from './mail.service';
import { GmailProvider } from './providers/gmail.provider';
import { EMAIL_PROVIDER } from './interfaces/email-provider.interface';

@Module({
    providers: [
        {
            provide: EMAIL_PROVIDER,
            useClass: GmailProvider,
        },
        MailService,
    ],
    exports: [MailService],
})
export class MailModule {}
