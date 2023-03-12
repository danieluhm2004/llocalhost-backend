import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiResponseBody } from './common/decorators/api-response-body';
import { ResClusterInfoDto } from './common/dto/clusterInfo.dto';

@ApiTags('시스템')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponseBody(ResClusterInfoDto)
  getClusterInfo() {
    return this.appService.getClusterInfoFromCache();
  }
}
