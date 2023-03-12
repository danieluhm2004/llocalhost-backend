import { PartialType, PickType } from '@nestjs/swagger';

import { ResGetAuthDto } from './get-auth.dto';
import { User } from '../../user/entities/user.entity';

export class ResEditAuthDto extends ResGetAuthDto {}

export class BodyEditAuthDto extends PartialType(
  PickType(User, ['name', 'email']),
) {}
