import { Injectable, NestMiddleware } from '@nestjs/common';

import { Opcode } from '../opcode';
import { SessionService } from '../../session/session.service';
import _ from 'lodash';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  async use(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) throw Opcode.NotAuthorized();
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') throw Opcode.NotAuthorized();
    const session = await this.sessionService.getByAccessToken(token);
    _.set(req, 'properties.session', session);
    next();
  }
}
