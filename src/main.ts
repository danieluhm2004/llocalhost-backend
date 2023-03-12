import { ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app.module';
import { NotFoundFilter } from './common/filters/notfound.filter';
import { WrapperInterceptor } from './common/interceptors/wrapper.interceptor';
import compression from 'compression';
import helmet from 'helmet';
import { setupSwagger } from './common/swagger';
import { validationPipe } from './common/pipes/validationPipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(compression());
  const reflector = app.get(Reflector);
  app.useGlobalPipes(validationPipe());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalInterceptors(new WrapperInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new NotFoundFilter());

  await setupSwagger(app);
  await app.listen(3001);
}
bootstrap();
