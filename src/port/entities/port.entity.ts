import { IsDate, IsNumber, IsString } from 'nestjs-swagger-dto';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Port extends BaseEntity {
  @PrimaryColumn()
  @IsNumber({
    description: '포트 ID',
    example: 23023,
  })
  portId: number;

  @Column()
  @IsString({
    description: '포트 이름',
    example: 'danieluhm2004',
    pattern: {
      regex: /^[a-zA-Z0-9-]{1,30}$/,
      message: '이름은 영문, 숫자, -, _ 만 사용할 수 있습니다.',
    },
  })
  name: string;

  @Column()
  @IsNumber({
    description: '사용자 ID',
    example: 36157019,
  })
  userId: number;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.ports)
  user: User;

  @CreateDateColumn()
  @IsDate({
    description: '생성일',
    format: 'date-time',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate({
    description: '수정일',
    format: 'date-time',
  })
  updatedAt: Date;
}
