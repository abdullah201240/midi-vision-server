import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

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
    const body = request.body as Record<string, unknown> | undefined;
    const now = Date.now();

    this.logger.log(`→ ${method} ${url}`);
    if (body && Object.keys(body).length > 0) {
      const sanitizedBody: Record<string, unknown> = { ...body };
      if (sanitizedBody.password) sanitizedBody.password = '***';
      this.logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;
        const delay = Date.now() - now;
        this.logger.log(`← ${method} ${url} ${statusCode} - ${delay}ms`);
      }),
      catchError((error: HttpError) => {
        const delay = Date.now() - now;
        const status = error.status || 500;
        this.logger.error(`✖ ${method} ${url} ${status} - ${delay}ms`);
        this.logger.error(`Error: ${error.message}`);
        if (error.stack) {
          this.logger.debug(`Stack trace: ${error.stack}`);
        }
        throw error;
      }),
    );
  }
}
