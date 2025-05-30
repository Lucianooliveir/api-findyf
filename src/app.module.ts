import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { DatabaseModule } from './database/database.module';
import { LoginModule } from './login/login.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostagemModule } from './postagem/postagem.module';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    LoginModule,
    PostagemModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
