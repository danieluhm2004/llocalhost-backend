import { PartialType } from '@nestjs/swagger';
import { BodyCreatePortDto } from './create-port.dto';
import { ResGetPortDto } from './get-port.dto';

export class ResEditPortDto extends ResGetPortDto {}

export class BodyEditPortDto extends PartialType(BodyCreatePortDto) {}
