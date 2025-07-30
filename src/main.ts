import 'reflect-metadata';
import 'module-alias/register';

import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'Yatra',
        }),
    });

    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe());

    logger.log('Application starting...');
    await app.listen(Number(process.env.PORT || '3000'));
    logger.log(`Application is running on port ${process.env.PORT || 3000}`);
}

bootstrap();
