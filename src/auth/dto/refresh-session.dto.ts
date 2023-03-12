import { IsNested } from 'nestjs-swagger-dto';
import { PickType } from '@nestjs/swagger';
import { Session } from '../../session/entities/session.entity';

export class BodyRefreshSessionAuthDto extends PickType(Session, [
  'refreshToken',
]) {}

export class ResRefreshSessionAuthDto {
  @IsNested({
    description: '새로운 세션',
    type: Session,
  })
  session: Session;
}
