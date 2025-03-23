import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { userProviders } from './login.providers';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  providers: [LoginService, ...userProviders, ...databaseProviders],
  controllers: [LoginController],
})
export class LoginModule {}
