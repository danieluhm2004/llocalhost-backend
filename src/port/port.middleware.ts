import { Injectable, NestMiddleware } from '@nestjs/common';

import { Opcode } from '../common/opcode';
import { PortService } from './port.service';
import { User } from '../user/entities/user.entity';
import _ from 'lodash';

@Injectable()
export class PortMiddleware implements NestMiddleware {
  constructor(private readonly portService: PortService) {}

  async use(req, res, next) {
    const portId = parseInt(req.params?.portId);
    if (isNaN(portId)) throw Opcode.CannotFindPort();
    const user: User = _.get(req, 'properties.session.user');
    const port = await this.portService.get(user, portId);
    _.set(req, 'properties.port', port);
    next();
  }
}
