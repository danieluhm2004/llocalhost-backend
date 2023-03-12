import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

import { Opcode } from '../opcode';

@Injectable()
export class WrapperInterceptor implements NestInterceptor {
  private readonly logger = new Logger(WrapperInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const pipe = map((data: any) => ({ opcode: 0, ...data }));
    context.switchToHttp().getResponse().status(200);
    const errorPipe = catchError((err) => {
      if (err.name !== 'HttpException') {
        this.logger.error(err.name, err);
        return throwError(() => Opcode.InvalidError());
      }

      return throwError(() => err);
    });

    return next.handle().pipe(errorPipe).pipe(pipe);
  }
}
