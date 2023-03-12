import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { generateWhere, WhereType } from '../common/generateWhere';
import { Opcode } from '../common/opcode';

import { BodyCreateUserDto } from './dto/create-user.dto';
import { BodyEditUserDto } from './dto/edit-user.dto';
import { QueryFindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async find(data: QueryFindUserDto): Promise<[User[], number]> {
    const searchTarget = {
      userId: WhereType.Equals,
      name: WhereType.Contains,
      email: WhereType.Contains,
    };

    const { take, skip, search, order } = data;
    let where: FindOptionsWhere<User>[] | FindOptionsWhere<User> = {};
    where = generateWhere<User>(where, search, searchTarget);
    const options: FindManyOptions<User> = { take, skip, order, where };
    return this.userRepository.findAndCount(options);
  }

  async get(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) throw Opcode.CannotFindUser();
    return user;
  }

  async upsert(body: BodyCreateUserDto): Promise<User> {
    const { userId } = body;
    const user = await this.userRepository.findOneBy({ userId });
    if (user) return this.edit(user, body);
    return this.create(body);
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(data: BodyCreateUserDto): Promise<User> {
    this.logger.log(`${data.name}(${data.email}) 사용자를 생성합니다.`);
    const user = this.userRepository.create(data);
    return user.save();
  }

  async edit(user: User, data: BodyEditUserDto): Promise<User> {
    this.logger.log(`${user.name}(${user.email}) 사용자를 수정합니다.`);
    return this.userRepository.merge(user, data).save();
  }

  async delete(user: User): Promise<User> {
    this.logger.log(`${user.name}(${user.email}) 사용자를 삭제합니다.`);
    return this.userRepository.remove(user);
  }
}
