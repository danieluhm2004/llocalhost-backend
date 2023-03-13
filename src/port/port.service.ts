import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign, SignOptions } from 'jsonwebtoken';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { generateWhere, WhereType } from '../common/generateWhere';
import { Opcode } from '../common/opcode';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { BodyCreatePortDto } from './dto/create-port.dto';
import { BodyEditPortDto } from './dto/edit-port.dto';
import { QueryFindPortDto } from './dto/find-port.dto';
import { Port } from './entities/port.entity';

@Injectable()
export class PortService {
  private readonly logger = new Logger(PortService.name);

  constructor(
    @InjectRepository(Port)
    private readonly portRepository: Repository<Port>,
    private readonly userService: UserService,
  ) {}

  async find(user: User, data: QueryFindPortDto): Promise<[Port[], number]> {
    const searchTarget = {
      portId: WhereType.Equals,
      name: WhereType.Contains,
    };

    const { take, skip, search, order } = data;
    let where: FindOptionsWhere<Port>[] | FindOptionsWhere<Port> = {};

    where.userId = user.userId;

    where = generateWhere<Port>(where, search, searchTarget);
    const options: FindManyOptions<Port> = { take, skip, order, where };
    return this.portRepository.findAndCount(options);
  }

  async findAll(user: User): Promise<Port[]> {
    const { userId } = user;
    return this.portRepository.findBy({ userId });
  }

  async get(user: User, portId: number): Promise<Port> {
    const { userId } = user;
    const port = await this.portRepository.findOneBy({ userId, portId });
    if (!port) throw Opcode.CannotFindPort();
    return port;
  }

  async getById(portId: number): Promise<Port> {
    const port = await this.portRepository.findOneBy({ portId });
    if (!port) throw Opcode.CannotFindPort();
    return port;
  }

  async create(createdBy: User, data: BodyCreatePortDto): Promise<Port> {
    const user =
      createdBy.isAdmin && data.userId
        ? await this.userService.get(data.userId)
        : createdBy;

    const { userId } = user;
    this.logger.log(
      `${createdBy.name}(${createdBy.email})님이 ${user.name}(${user.email})님의 포트를 생성합니다.`,
    );

    const portId = await this.allocate();
    return this.portRepository.create({ ...data, portId, userId }).save();
  }

  access(port: Port): string {
    const { portId, name, userId } = port;
    this.logger.log(`${name}(${portId}) 포트에 접근을 요청합니다.`);
    const payload = { portId, name, userId };
    const options: SignOptions = { expiresIn: '1m', subject: 'port' };
    return sign(payload, process.env.BRIDGE_SECRET, options);
  }

  async allocate(): Promise<number> {
    while (true) {
      const port = this.random(35000, 59999);
      const isExists = await this.isExists(port);
      if (!isExists) return port;
    }
  }

  private random(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  async isExists(portId: number): Promise<boolean> {
    return this.portRepository.countBy({ portId }).then((r) => r > 0);
  }

  async edit(port: Port, data: BodyEditPortDto): Promise<Port> {
    this.logger.log(`${port.name}(${port.portId}) 포트를 수정합니다.`);
    return this.portRepository.merge(port, data).save();
  }

  async delete(port: Port): Promise<Port> {
    this.logger.log(`${port.name}(${port.portId}) 포트를 삭제합니다.`);
    return port.remove();
  }
}
