import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { userProviders } from './login.providers';
import { databaseProviders } from 'src/database/database.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/config/constants';

@Module({
  providers: [LoginService, ...userProviders, ...databaseProviders],
  controllers: [LoginController],
  imports: [JwtModule.register({ global: true, secret: jwtConstant })],
})
export class LoginModule {}
