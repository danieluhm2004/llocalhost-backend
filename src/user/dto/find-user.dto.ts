import { IsNested, IsNumber } from 'nestjs-swagger-dto';

import { FindDto } from '../../common/dto/find.dto';
import { User } from '../entities/user.entity';

export class ResFindUserDto {
  @IsNested({ description: '사용자 목록', type: User, isArray: true })
  users: User[];

  @IsNumber({ description: '총 사용자수', example: 10 })
  total: number;
}

export class QueryFindUserDto extends FindDto {}
