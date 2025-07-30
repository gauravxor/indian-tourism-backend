import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { UserService } from '../../user/user.service';
import { SignupDto } from '../dtos/signup.dto';
import { MailService } from '../../mail/mail.service';

import { OtpService } from './otp.service';

@Injectable()
export class SignupService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly otpService: OtpService
    ) {}

    async handle(dto: SignupDto) {
        const existingUser = await this.userService.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = await this.userService.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });

        const otp = await this.otpService.createOtp(newUser.id, 'email verification', 'email');

        await this.mailService.sendOtpEmail(newUser.email, newUser.name, otp);
        return {
            message: 'Signup successful',
            user: {
                name: newUser.name,
                email: newUser.email,
                id: newUser.id,
            },
        };
    }
}
