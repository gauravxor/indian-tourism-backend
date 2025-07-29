import * as path from 'path';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
    migrations: [path.join(__dirname, '../database/migrations/**/*.{ts,js}')],
});
