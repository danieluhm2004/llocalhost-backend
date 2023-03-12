import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import _ from 'lodash';
import { Session } from '../../session/entities/session.entity';
import { User } from '../../user/entities/user.entity';

export const options: TypeOrmModuleOptions = {
  type: 'mysql',
  host: _.get(process.env, 'DB_HOST', 'localhost'),
  port: _.parseInt(_.get(process.env, 'DB_PORT', '3306')),
  database: _.get(process.env, 'DB_DATABASE', 'root'),
  username: _.get(process.env, 'DB_USERNAME', 'root'),
  password: _.get(process.env, 'DB_PASSWORD'),
  keepConnectionAlive: true,
  synchronize: false,
  entities: [User, Session],
};

@Module({ imports: [TypeOrmModule.forRoot(options)] })
export class DatabaseModule {}
