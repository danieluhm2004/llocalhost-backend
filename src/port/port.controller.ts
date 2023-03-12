import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseBody } from '../common/decorators/api-response-body';
import { AuthorizedUser } from '../common/decorators/auth.decorator';
import {} from '../common/decorators/guard.decorator';
import { PropertyParam } from '../common/decorators/property-param';
import { User } from '../user/entities/user.entity';
import { BodyCreatePortDto, ResCreatePortDto } from './dto/create-port.dto';
import { ResDeletePortDto } from './dto/delete-port.dto';
import { BodyEditPortDto, ResEditPortDto } from './dto/edit-port.dto';
import { QueryFindPortDto, ResFindPortDto } from './dto/find-port.dto';
import { ResGetPortDto } from './dto/get-port.dto';
import { Port } from './entities/port.entity';
import { PortService } from './port.service';

@ApiBearerAuth()
@ApiTags('포트')
@Controller({ path: 'ports', version: '1' })
export class PortController {
  constructor(private readonly portService: PortService) {}

  @Get()
  @ApiOperation({ summary: '포트 목록' })
  @ApiResponseBody(ResFindPortDto)
  async find(
    @AuthorizedUser() user: User,
    @Query() query: QueryFindPortDto,
  ): Promise<ResFindPortDto> {
    const res = new ResFindPortDto();
    const [ports, total] = await this.portService.find(user, query);
    res.ports = ports;
    res.total = total;
    return res;
  }

  @Get(':portId')
  @ApiOperation({ summary: '포트 조회' })
  @ApiParam({ name: 'portId', description: '포트 ID' })
  @ApiResponseBody(ResGetPortDto)
  async get(@PropertyParam('port') port: Port): Promise<ResGetPortDto> {
    const res = new ResGetPortDto();
    res.port = port;
    return res;
  }

  @Post()
  @ApiOperation({ summary: '포트 생성' })
  @ApiResponseBody(ResCreatePortDto)
  async create(
    @AuthorizedUser() user: User,
    @Body() body: BodyCreatePortDto,
  ): Promise<ResCreatePortDto> {
    const res = new ResCreatePortDto();
    res.port = await this.portService.create(user, body);
    return res;
  }

  @Patch(':portId')
  @ApiOperation({ summary: '포트 수정' })
  @ApiParam({ name: 'portId', description: '포트 ID' })
  @ApiResponseBody(ResEditPortDto)
  async edit(
    @PropertyParam('port') port: Port,
    @Body() body: BodyEditPortDto,
  ): Promise<ResEditPortDto> {
    const res = new ResEditPortDto();
    res.port = await this.portService.edit(port, body);
    return res;
  }

  @Delete(':portId')
  @ApiOperation({ summary: '포트 삭제' })
  @ApiParam({ name: 'portId', description: '포트 ID' })
  @ApiResponseBody(ResDeletePortDto)
  async delete(@PropertyParam('port') port: Port): Promise<ResDeletePortDto> {
    const res = new ResDeletePortDto();
    await this.portService.delete(port);
    return res;
  }
}
