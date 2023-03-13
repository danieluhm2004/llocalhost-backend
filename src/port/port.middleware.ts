import { Injectable, NestMiddleware } from '@nestjs/common';

import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { User } from '../user/entities/user.entity';
import { PortService } from './port.service';

@Injectable()
export class PortMiddleware implements NestMiddleware {
  constructor(private readonly portService: PortService) {}

  async use(req, res, next) {
    const { name } = req.params;
    if (!name) throw Opcode.CannotFindPort();
    const user: User = _.get(req, 'properties.session.user');
    const port = await this.portService.getByName(user, name);
    _.set(req, 'properties.port', port);
    next();
  }
}
