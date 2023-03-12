import { Opcode } from '../opcode';
import { ValidationPipe } from '@nestjs/common';

export const validationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (details) => Opcode.ValidateFailed({ details }),
    transformOptions: {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
      groups: ['flag:request'],
    },
  });
