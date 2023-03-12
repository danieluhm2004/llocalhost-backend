import { Injectable, Logger } from '@nestjs/common';

import fetch from 'node-fetch';
import { Octokit } from 'octokit';
import { Session } from '../session/entities/session.entity';
import { SessionService } from '../session/session.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { BodyEditAuthDto } from './dto/edit-auth.dto';
import { BodyRefreshSessionAuthDto } from './dto/refresh-session.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async edit(user: User, data: BodyEditAuthDto): Promise<User> {
    return this.userService.edit(user, data);
  }

  async createSession(user: User, name: string): Promise<Session> {
    return this.sessionService.create(user, { name });
  }

  async refreshSession(
    data: BodyRefreshSessionAuthDto,
    name: string,
  ): Promise<Session> {
    return this.sessionService.refresh(data.refreshToken, name);
  }

  async login(accessToken: string): Promise<User> {
    const octokit = new Octokit({
      auth: accessToken,
      request: { fetch },
    });

    const {
      id: userId,
      name,
      email,
    } = await octokit.rest.users.getAuthenticated().then((r) => r.data);
    return this.userService.upsert({ userId, name, email });
  }
}
