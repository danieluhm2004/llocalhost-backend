import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseBody } from '../common/decorators/api-response-body';
import { AuthorizedUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { BodyEditAuthDto, ResEditAuthDto } from './dto/edit-auth.dto';
import { ResGetAuthDto } from './dto/get-auth.dto';
import { BodyLoginAuthDto, ResLoginAuthDto } from './dto/login.dto';
import {
  BodyRefreshSessionAuthDto,
  ResRefreshSessionAuthDto,
} from './dto/refresh-session.dto';

@ApiTags('인증')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보' })
  @ApiResponseBody(ResGetAuthDto)
  get(@AuthorizedUser() user: User) {
    const res = new ResGetAuthDto();
    res.user = user;
    return res;
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '정보 수정' })
  @ApiResponseBody(ResEditAuthDto)
  async edit(@AuthorizedUser() user: User, @Body() body: BodyEditAuthDto) {
    const res = new ResEditAuthDto();
    res.user = await this.authService.edit(user, body);
    return res;
  }

  @Post('refresh')
  @ApiOperation({ summary: '세션 갱신' })
  @ApiResponseBody(ResRefreshSessionAuthDto)
  async refresh(
    @Headers('user-agent') userAgent: string,
    @Body() body: BodyRefreshSessionAuthDto,
  ) {
    const res = new ResRefreshSessionAuthDto();
    res.session = await this.authService.refreshSession(body, userAgent);
    return res;
  }

  @Post('login')
  @ApiOperation({ summary: '깃허브로 로그인' })
  @ApiResponseBody(ResLoginAuthDto)
  async loginByPassword(
    @Body() body: BodyLoginAuthDto,
    @Headers('user-agent') userAgent: string,
  ) {
    const res = new ResLoginAuthDto();
    res.user = await this.authService.login(body.accessToken);
    res.session = await this.authService.createSession(res.user, userAgent);
    return res;
  }
}
