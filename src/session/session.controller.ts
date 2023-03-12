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
import { IsAdmin } from '../common/decorators/guard.decorator';
import { PropertyParam } from '../common/decorators/property-param';
import { User } from '../user/entities/user.entity';
import {
  BodyCreateSessionDto,
  ResCreateSessionDto,
} from './dto/create-session.dto';
import { ResDeleteSessionDto } from './dto/delete-session.dto';
import { BodyEditSessionDto, ResEditSessionDto } from './dto/edit-session.dto';
import { QueryFindSessionDto, ResFindSessionDto } from './dto/find-session.dto';
import { ResGetSessionDto } from './dto/get-session.dto';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@ApiTags('세션')
@ApiBearerAuth()
@Controller({ path: 'sessions', version: '1' })
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: '세션 목록' })
  @ApiResponseBody(ResFindSessionDto)
  async find(
    @AuthorizedUser() user: User,
    @Query() query: QueryFindSessionDto,
  ): Promise<ResFindSessionDto> {
    const res = new ResFindSessionDto();
    const [sessions, total] = await this.sessionService.find(user, query);
    res.sessions = sessions;
    res.total = total;
    return res;
  }

  @Get(':sessionId')
  @ApiOperation({ summary: '세션 조회' })
  @ApiParam({ name: 'sessionId', description: '세션 ID' })
  @ApiResponseBody(ResGetSessionDto)
  async get(
    @PropertyParam('session') session: Session,
  ): Promise<ResGetSessionDto> {
    const res = new ResGetSessionDto();
    res.session = session;
    return res;
  }

  @Post()
  @IsAdmin()
  @ApiOperation({ summary: '(관리자) 세션 생성' })
  @ApiResponseBody(ResCreateSessionDto)
  async create(
    @AuthorizedUser() user: User,
    @Body() body: BodyCreateSessionDto,
  ): Promise<ResCreateSessionDto> {
    const res = new ResCreateSessionDto();
    res.session = await this.sessionService.create(user, body);
    return res;
  }

  @IsAdmin()
  @Patch(':sessionId')
  @ApiOperation({ summary: '(관리자) 세션 수정' })
  @ApiParam({ name: 'sessionId', description: '세션 ID' })
  @ApiResponseBody(ResEditSessionDto)
  async edit(
    @PropertyParam('session') session: Session,
    @Body() body: BodyEditSessionDto,
  ): Promise<ResEditSessionDto> {
    const res = new ResEditSessionDto();
    res.session = await this.sessionService.edit(session, body);
    return res;
  }

  @Delete(':sessionId')
  @ApiOperation({ summary: '세션 로그아웃' })
  @ApiParam({ name: 'sessionId', description: '세션 ID' })
  @ApiResponseBody(ResDeleteSessionDto)
  async delete(
    @PropertyParam('session') session: Session,
  ): Promise<ResDeleteSessionDto> {
    const res = new ResEditSessionDto();
    res.session = await this.sessionService.delete(session);
    return res;
  }
}
