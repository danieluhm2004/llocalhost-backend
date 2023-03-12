import { BodyCreateSessionDto } from './create-session.dto';
import { PartialType } from '@nestjs/swagger';
import { ResGetSessionDto } from './get-session.dto';

export class ResEditSessionDto extends ResGetSessionDto {}

export class BodyEditSessionDto extends PartialType(BodyCreateSessionDto) {}
