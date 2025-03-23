import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { DatabaseModule } from './database/database.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [DatabaseModule, LoginModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
