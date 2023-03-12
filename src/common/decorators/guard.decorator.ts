import { UseGuards, applyDecorators } from '@nestjs/common';

import { AdminGuard } from '../guards/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const IsAdmin = () =>
  applyDecorators(UseGuards(AdminGuard), ApiBearerAuth());
