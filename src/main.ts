import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, Logger } from '@nestjs/common';

import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'Yatra',
        }),
    });

    logger.log('Application starting...');
    await app.listen(Number(process.env.PORT || '3000'));
    logger.log(`Application is running on port ${process.env.PORT || 3000}`);
}

bootstrap();
