import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request } from 'express';

interface HttpError extends Error {
  status?: number;
  message: string;
  stack?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        // Request completed successfully - no logging
      }),
      catchError((error: HttpError) => {
        const delay = Date.now() - now;
        const status = error.status || 500;
        this.logger.error(`✖ ${method} ${url} ${status} - ${delay}ms`);
        this.logger.error(`Error: ${error.message}`);
        throw error;
      }),
    );
  }
}
