import { BodyCreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';
import { ResGetUserDto } from './get-user.dto';

export class ResEditUserDto extends ResGetUserDto {}

export class BodyEditUserDto extends PartialType(BodyCreateUserDto) {}
