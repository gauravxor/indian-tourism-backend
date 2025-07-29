import { LoggerService } from '@nestjs/common';

import logger from '../config/logger';

export class WinstonLogger implements LoggerService {
    log(message: string) {
        logger.info(message);
    }

    error(message: string, trace?: string) {
        logger.error(`${message}${trace ? ' - ' + trace : ''}`);
    }

    warn(message: string) {
        logger.warn(message);
    }

    debug(message: string) {
        logger.debug?.(message);
    }

    verbose(message: string) {
        logger.verbose?.(message);
    }
}
