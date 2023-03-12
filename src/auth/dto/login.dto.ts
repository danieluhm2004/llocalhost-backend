import { IsNested, IsString } from 'nestjs-swagger-dto';

import { Session } from '../../session/entities/session.entity';
import { User } from '../../user/entities/user.entity';

export class ResLoginAuthDto {
  @IsNested({
    description: '사용자 정보',
    type: User,
  })
  user: User;

  @IsNested({
    description: '세션 정보',
    type: Session,
  })
  session: Session;
}

export class BodyLoginAuthDto {
  @IsString({
    description: 'Github Access Token',
    example: 'gho_1234567890',
  })
  accessToken: string;
}
