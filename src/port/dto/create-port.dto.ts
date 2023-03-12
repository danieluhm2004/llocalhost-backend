import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'nestjs-swagger-dto';
import { Port } from '../entities/port.entity';
import { ResGetPortDto } from './get-port.dto';

export class ResCreatePortDto extends ResGetPortDto {}
export class BodyCreatePortDto extends PickType(Port, ['name'] as const) {
  @IsNumber({
    description: '사용자 ID',
    example: 36157019,
    optional: true,
  })
  userId?: number;
}
