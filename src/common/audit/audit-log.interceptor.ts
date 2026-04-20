import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';
import { getClientIp, sanitizeBody } from './audit-log.util';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const user = request.user;

    const { method, originalUrl } = request;

    const ip = getClientIp(request);

    const requestBody = sanitizeBody(request.body);

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = Date.now() - now;

        this.auditService.log({
          userId: user?.id,
          method,
          url: originalUrl,
          ip,
          requestBody,
          responseBody: sanitizeBody(responseBody),
          statusCode: response.statusCode,
          durationMs: duration,
          userAgent: request.headers['user-agent'],
        });
      }),
    );
  }
}