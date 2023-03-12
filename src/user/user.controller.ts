import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiResponseBody } from '../common/decorators/api-response-body';
import { IsAdmin } from '../common/decorators/guard.decorator';
import { PropertyParam } from '../common/decorators/property-param';
import { BodyCreateUserDto, ResCreateUserDto } from './dto/create-user.dto';
import { ResDeleteUserDto } from './dto/delete-user.dto';
import { BodyEditUserDto, ResEditUserDto } from './dto/edit-user.dto';
import { QueryFindUserDto, ResFindUserDto } from './dto/find-user.dto';
import { ResGetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@IsAdmin()
@ApiTags('(관리자) 사용자')
@SerializeOptions({ groups: ['controller:user'] })
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '사용자 목록' })
  @ApiResponseBody(ResFindUserDto)
  async find(@Query() query: QueryFindUserDto): Promise<ResFindUserDto> {
    const res = new ResFindUserDto();
    const [users, total] = await this.userService.find(query);
    res.users = users;
    res.total = total;
    return res;
  }

  @Get(':userId')
  @ApiOperation({ summary: '사용자 조회' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponseBody(ResGetUserDto)
  async get(@PropertyParam('user') user: User): Promise<ResGetUserDto> {
    const res = new ResGetUserDto();
    res.user = user;
    return res;
  }

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiResponseBody(ResCreateUserDto)
  async create(@Body() body: BodyCreateUserDto): Promise<ResCreateUserDto> {
    const res = new ResCreateUserDto();
    res.user = await this.userService.create(body);
    return res;
  }

  @Patch(':userId')
  @ApiOperation({ summary: '사용자 수정' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponseBody(ResEditUserDto)
  async edit(
    @PropertyParam('user') user: User,
    @Body() body: BodyEditUserDto,
  ): Promise<ResEditUserDto> {
    const res = new ResEditUserDto();
    res.user = await this.userService.edit(user, body);
    return res;
  }

  @Delete(':userId')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponseBody(ResDeleteUserDto)
  async delete(@PropertyParam('user') user: User): Promise<ResDeleteUserDto> {
    const res = new ResEditUserDto();
    res.user = await this.userService.delete(user);
    return res;
  }
}
