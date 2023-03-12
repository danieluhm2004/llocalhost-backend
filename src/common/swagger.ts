import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppService } from '../app.service';
import { INestApplication } from '@nestjs/common';
import { Opcode } from './opcode';
import { ResClusterInfoDto } from './dto/clusterInfo.dto';

const getDescription = (clusterInfo: ResClusterInfoDto) => {
  let description = clusterInfo.description;
  description += '<br/>';
  for (const [type, error] of Object.entries(Opcode)) {
    const { response, message, status }: any = error();
    description += `<br/><b>${response.opcode} (${type})</b> / ${status} ${message}`;
  }

  return description;
};

export const setupSwagger = async (app: INestApplication) => {
  const clusterInfo = await new AppService().getClusterInfo();
  const config = new DocumentBuilder()
    .setTitle(clusterInfo.name)
    .setDescription(getDescription(clusterInfo))
    .setVersion(clusterInfo.version)
    .addTag('시스템', '시스템과 관련된 것들을 처리합니다.')
    .addTag('인증', '로그인, 회원가입 등과 같은 인증을 처리합니다.')
    .addTag('인증수단', '비밀번호, 구글 로그인과 같은 인증수단을 관리합니다.')
    .addTag('세션', '로그인된 세션을 관리합니다.')
    .addTag('(관리자) 사용자', '사용자 정보에 대해 관리합니다.')
    .addBearerAuth({
      description: '인증 토큰',
      name: 'Authorization',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
