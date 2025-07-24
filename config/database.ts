import 'dotenv/config';
import path from 'path';

import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3301'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'indian_tourism',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [path.join(__dirname, '../src/entities/**/*.{ts,js}')],
    migrations: [path.join(__dirname, '../src/database/migrations/**/*.{ts,js}')],
});

export default AppDataSource;
