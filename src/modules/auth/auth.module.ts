import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [SignupService, LoginService],
})
export class AuthModule {}
