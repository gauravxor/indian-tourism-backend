import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { UserService } from '../../user/user.service';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LoginService {
    private readonly logger = new Logger(LoginService.name);

    constructor(private readonly userService: UserService) {}

    async handle(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            throw new NotFoundException('User does not exist');
        }

        const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordCorrect) {
            throw new UnauthorizedException('Incorrect password');
        }

        return {
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
