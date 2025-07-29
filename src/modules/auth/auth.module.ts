import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { SignupService } from './services/signup.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [SignupService],
})
export class AuthModule {}
