import { IsNested } from 'nestjs-swagger-dto';
import { Port } from '../entities/port.entity';

export class ResGetPortDto {
  @IsNested({ description: '포트 정보', type: Port })
  port: Port;
}
