import { IsDate, IsNested, IsNumber, IsString } from 'nestjs-swagger-dto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString({
    description: '세션 ID',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  sessionId: string;

  @Column()
  @IsString({
    description: '세션 이름',
    example: 'Macbook Air',
  })
  name: string;

  @Column()
  @IsNumber({
    description: '사용자 ID',
    example: 36157019,
  })
  userId: number;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column()
  @IsString({
    description: '액세스 토큰',
    example: '9ETHCpT+jMrBxP7KCuDScO5HTtmwmazZ8+IZYI3p30I=',
  })
  accessToken: string;

  @Column()
  @IsString({
    description: '리프레시 토큰',
    example:
      'X7/77jNSrnOgOVNE/OwzeenILhRl1vxD3BEdpq1LJCpJoHegGEH+XlbaQbsd42kpb5XPHja6TPu/zu1x00kvXQ==',
  })
  refreshToken: string;

  @CreateDateColumn()
  @IsDate({
    format: 'date-time',
    description: '토큰 업데이트일',
  })
  refreshedAt: Date;

  @CreateDateColumn()
  @IsDate({
    format: 'date-time',
    description: '마지막 접속일',
  })
  accessedAt: Date;

  @Column()
  @IsDate({
    format: 'date-time',
    description: '리프레시 토큰 만료일',
  })
  expiresAt: Date;

  @CreateDateColumn()
  @IsDate({
    description: '세션 생성일',
    format: 'date-time',
  })
  createdAt: Date;
}

export class SessionWithUser extends Session {
  @IsNested({
    description: '사용자 정보',
    type: User,
  })
  user: User;
}
