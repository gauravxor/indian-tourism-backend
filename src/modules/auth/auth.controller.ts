import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { SignupService } from './services/signup.service';
import { LoginService } from './services/login.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly signupService: SignupService,
        private readonly loginService: LoginService
    ) {}

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.signupService.handle(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.loginService.handle(dto);
    }
}
