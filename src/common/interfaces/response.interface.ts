import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import {
  RESPONSE_IS_PAGINATED_KEY,
  RESPONSE_MESSAGE_KEY,
} from '../decorators/response-message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      'Request successful';

    const isPaginated =
      this.reflector.get<boolean>(
        RESPONSE_IS_PAGINATED_KEY,
        context.getHandler(),
      ) || false;

    return next.handle().pipe(
      map((response) => {
        if (isPaginated) {
          return {
            success: true,
            message,
            data: response.data ?? [],
            meta: {
              page: response.page ?? 1,
              limit: response.limit ?? 10,
              total: response.total ?? 0,
              totalPages: response.totalPages ?? 0,
            },
          };
        }

        return {
          success: true,
          message,
          data: response,
        };
      }),
    );
  }
}
