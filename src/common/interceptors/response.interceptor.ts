import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        return next.handle().pipe(
            map(data => {
                const { message, ...rest } = data || {};

                return {
                    statusCode: response.statusCode,
                    message: message || 'success',
                    data: rest,
                };
            })
        );
    }
}
