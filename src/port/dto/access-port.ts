import { IsString } from 'nestjs-swagger-dto';

export class ResAccessPortDto {
  @IsString({
    description: '포트 접근 토큰',
    example: 'ey...',
  })
  token: string;
}
