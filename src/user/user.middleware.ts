import { Injectable, NestMiddleware } from '@nestjs/common';

import { Opcode } from '../common/opcode';
import { UserService } from './user.service';
import _ from 'lodash';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req, res, next) {
    const { userId } = req.params;
    if (!userId) throw Opcode.CannotFindUser();
    const user = await this.userService.get(userId);
    _.set(req, 'properties.user', user);
    next();
  }
}
