import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateOtp } from '@root/src/common/utils/otp.utils';

import { Otp } from '../entities/otp.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private readonly otpRepository: Repository<Otp>
    ) {}

    async validateOtp(userId: string, purpose: string) {
        const otpData = await this.otpRepository.findOne({
            where: {
                userId: { id: userId },
                purpose,
            },
        });

        if (!otpData) {
            return false;
        }

        if (otpData.expiresAt < new Date()) {
            await this.otpRepository.remove(otpData);
            return false;
        }

        await this.otpRepository.remove(otpData);
        return true;
    }

    async createOtp(userId: string, purpose: string, medium: string) {
        const otp = generateOtp();

        const expiresIn = 10;

        const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000);

        const otpEntity = this.otpRepository.create({
            otp,
            purpose,
            medium,
            expiresAt,
            userId: { id: userId },
        });

        await this.otpRepository.save(otpEntity);

        return otp;
    }
}
