import { PickType } from '@nestjs/swagger';
import { ResGetSessionDto } from './get-session.dto';
import { Session } from '../entities/session.entity';

export class ResCreateSessionDto extends ResGetSessionDto {}
export class BodyCreateSessionDto extends PickType(Session, [
  'name',
] as const) {}
