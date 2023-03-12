import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import moment from 'moment';
import {
  FindManyOptions,
  FindOptionsWhere,
  MoreThan,
  Repository,
} from 'typeorm';
import { generateWhere, WhereType } from '../common/generateWhere';
import { Opcode } from '../common/opcode';
import { User } from '../user/entities/user.entity';
import { BodyCreateSessionDto } from './dto/create-session.dto';
import { BodyEditSessionDto } from './dto/edit-session.dto';
import { QueryFindSessionDto } from './dto/find-session.dto';
import { Session, SessionWithUser } from './entities/session.entity';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async find(
    user: User,
    data: QueryFindSessionDto,
  ): Promise<[Session[], number]> {
    const searchTarget = {
      sessionId: WhereType.Equals,
      name: WhereType.Contains,
      accessToken: WhereType.Equals,
      refreshToken: WhereType.Equals,
    };

    const { take, skip, search, order } = data;
    let where: FindOptionsWhere<Session>[] | FindOptionsWhere<Session> = {};

    where.userId = user.userId;

    where = generateWhere<Session>(where, search, searchTarget);
    const options: FindManyOptions<Session> = { take, skip, order, where };
    return this.sessionRepository.findAndCount(options);
  }

  async refresh(refreshToken: string, name: string): Promise<Session> {
    const session = await this.sessionRepository.findOneBy({
      refreshToken,
      expiresAt: MoreThan(new Date()),
    });

    if (!session) throw Opcode.NotAuthorized();
    this.logger.log(`${session.sessionId} 세션을 갱신합니다.`);
    session.name = name;
    session.refreshedAt = new Date();

    const token = this.generateToken();
    session.accessToken = token.accessToken;
    session.refreshToken = token.refreshToken;
    return session.save();
  }

  async get(user: User, sessionId: string): Promise<Session> {
    const { userId } = user;
    const session = await this.sessionRepository.findOneBy({
      userId,
      sessionId,
    });

    if (!session) throw Opcode.CannotFindSession();
    return session;
  }

  async create(user: User, data: BodyCreateSessionDto): Promise<Session> {
    this.logger.log(`${user.name}(${user.email})님에 대한 세션을 생성합니다.`);
    const { name } = data;
    const { userId } = user;
    const { accessToken, refreshToken } = this.generateToken();
    const expiresAt = moment().add(1, 'months').toDate();
    return this.sessionRepository
      .create({
        name,
        userId,
        accessToken,
        refreshToken,
        expiresAt,
      })
      .save();
  }

  async edit(session: Session, data: BodyEditSessionDto): Promise<Session> {
    this.logger.log(`${session.name}(${session.sessionId}) 세션을 수정합니다.`);
    return this.sessionRepository.merge(session, data).save();
  }

  async delete(session: Session): Promise<Session> {
    this.logger.log(`${session.name}(${session.sessionId}) 세션을 삭제합니다.`);
    return this.sessionRepository.remove(session);
  }

  async getByAccessToken(accessToken: string): Promise<SessionWithUser> {
    const session = await this.sessionRepository.findOne({
      where: { accessToken },
      relations: ['user'],
    });

    if (!session) throw Opcode.NotAuthorized();
    if (moment().subtract(5, 'minutes').isAfter(session.refreshedAt)) {
      throw Opcode.ExpiredAccessToken();
    }

    session.accessedAt = new Date();
    session.user.accessedAt = new Date();
    await session.user.save();
    return session.save();
  }

  private generateToken(): Pick<Session, 'accessToken' | 'refreshToken'> {
    return {
      accessToken: randomBytes(32).toString('base64'),
      refreshToken: randomBytes(64).toString('base64'),
    };
  }
}
