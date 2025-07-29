import { Body, Controller, Post } from '@nestjs/common';

import { SignupDto } from './dtos/signup.dto';
import { SignupService } from './services/signup.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly signupService: SignupService) {}

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.signupService.handle(dto);
    }
}
