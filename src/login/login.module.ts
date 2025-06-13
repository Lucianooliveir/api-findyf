import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { userProviders } from './login.providers';
import { databaseProviders } from 'src/database/database.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/config/constants';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  providers: [LoginService, ...userProviders, ...databaseProviders],
  controllers: [LoginController],
  imports: [
    JwtModule.register({ global: true, secret: jwtConstant }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/pfp',
        filename(req, file, callback) {
          const filename = Date.now() + '.jpg';
          callback(null, filename);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  ],
})
export class LoginModule {}
