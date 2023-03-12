import { IsNested } from 'nestjs-swagger-dto';
import { User } from '../entities/user.entity';

export class ResGetUserDto {
  @IsNested({ description: '사용자 정보', type: User })
  user: User;
}
