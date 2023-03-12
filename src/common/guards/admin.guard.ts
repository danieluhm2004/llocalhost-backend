import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Opcode } from '../opcode';
import { User } from '../../user/entities/user.entity';
import _ from 'lodash';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user: User = _.get(req.properties, 'session.user');
    if (!user.isAdmin) throw Opcode.PermissionRequired();
    return true;
  }
}
