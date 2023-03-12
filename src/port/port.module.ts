import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Port } from './entities/port.entity';
import { PortController } from './port.controller';
import { PortService } from './port.service';

@Module({
  imports: [TypeOrmModule.forFeature([Port]), UserModule],
  controllers: [PortController],
  providers: [PortService],
  exports: [PortService],
})
export class PortModule {}
