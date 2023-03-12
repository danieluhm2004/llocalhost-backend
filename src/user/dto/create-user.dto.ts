import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';
import { ResGetUserDto } from './get-user.dto';

export class ResCreateUserDto extends ResGetUserDto {}
export class BodyCreateUserDto extends IntersectionType(
  PickType(User, ['userId', 'name', 'email'] as const),
  PartialType(PickType(User, ['isAdmin'] as const)),
) {}
