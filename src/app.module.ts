import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DatabaseModule } from './common/modules/database.module';
import { PortMiddleware } from './port/port.middleware';
import { PortModule } from './port/port.module';
import { SessionMiddleware } from './session/session.middleware';
import { SessionModule } from './session/session.module';
import { UserMiddleware } from './user/user.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [DatabaseModule, UserModule, SessionModule, AuthModule, PortModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .exclude(
        /** Main */
        {
          path: '/',
          method: RequestMethod.ALL,
        },

        /** Auth */
        {
          path: ':version/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: ':version/auth/refresh',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');

    consumer.apply(UserMiddleware).forRoutes(':version/users/:userId');
    consumer.apply(SessionMiddleware).forRoutes(':version/sessions/:sessionId');
    consumer.apply(PortMiddleware).forRoutes(':version/ports/:portId');
  }
}
