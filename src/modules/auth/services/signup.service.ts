import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { UserService } from '../../user/user.service';
import { SignupDto } from '../dtos/signup.dto';

@Injectable()
export class SignupService {
    constructor(private readonly userService: UserService) {}

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
