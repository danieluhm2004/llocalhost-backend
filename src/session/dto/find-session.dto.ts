import { IsNested, IsNumber } from 'nestjs-swagger-dto';

import { FindDto } from '../../common/dto/find.dto';
import { Session } from '../entities/session.entity';

export class ResFindSessionDto {
  @IsNested({ description: '세션 목록', type: Session, isArray: true })
  sessions: Session[];

  @IsNumber({ description: '총 세션수', example: 10 })
  total: number;
}

export class QueryFindSessionDto extends FindDto {}
