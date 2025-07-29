import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './config/typeorm.config';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forRoot(typeOrmConfig())],
})
export class AppModule {}
