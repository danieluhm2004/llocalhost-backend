import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'nestjs-swagger-dto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Session } from '../../session/entities/session.entity';

const exposePrivateGroups = [
  'flag:hidden',
  'controller:auth',
  'controller:user',
  'controller:internal',
];

@Entity()
@Exclude()
export class User extends BaseEntity {
  @Expose()
  @PrimaryColumn()
  @IsNumber({
    description: '사용자 ID',
    example: 36157019,
  })
  userId: number;

  @Expose()
  @Column()
  @IsString({
    description: '이름',
    example: 'Daniel Uhm',
  })
  name: string;

  @Expose()
  @Column()
  @IsString({
    isEmail: true,
    description: '이메일',
    example: 'daniel.uhm@packet.stream',
  })
  email: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @IsBoolean({
    description: '관리자 인증 여부',
    example: true,
  })
  @Column({ default: false })
  isAdmin: boolean;

  @Expose({ groups: exposePrivateGroups })
  @CreateDateColumn()
  @IsDate({
    format: 'date-time',
    description: '마지막 접속일',
  })
  accessedAt: Date;

  @Expose()
  @CreateDateColumn()
  @IsDate({
    format: 'date-time',
    description: '회원가입 일자',
    example: new Date(0),
  })
  createdAt: Date;

  @Expose({ groups: exposePrivateGroups })
  @UpdateDateColumn()
  @IsDate({
    format: 'date-time',
    description: '회원정보 수정 일자',
    example: new Date(0),
  })
  updatedAt: Date;
}
