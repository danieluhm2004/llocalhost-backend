import { IsNested } from 'nestjs-swagger-dto';
import { Session } from '../entities/session.entity';

export class ResGetSessionDto {
  @IsNested({ description: '세션 정보', type: Session })
  session: Session;
}
