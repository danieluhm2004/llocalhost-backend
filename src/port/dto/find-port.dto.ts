import { IsNested, IsNumber } from 'nestjs-swagger-dto';

import { FindDto } from '../../common/dto/find.dto';
import { Port } from '../entities/port.entity';

export class ResFindPortDto {
  @IsNested({ description: '포트 목록', type: Port, isArray: true })
  ports: Port[];

  @IsNumber({ description: '총 포트 갯수', example: 10 })
  total: number;
}

export class QueryFindPortDto extends FindDto {}
