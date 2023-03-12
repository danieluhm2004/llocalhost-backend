import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';

import { Opcode } from '../opcode';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const body = Opcode.NotFound().getResponse();
    host.switchToHttp().getResponse().status(404).json(body);
  }
}
