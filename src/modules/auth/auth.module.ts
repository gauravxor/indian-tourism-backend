import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Otp } from '../auth/entities/otp.entity';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

import { OtpService } from './services/otp.service';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Otp]), UserModule, MailModule],
    controllers: [AuthController],
    providers: [SignupService, LoginService, OtpService],
})
export class AuthModule {}
