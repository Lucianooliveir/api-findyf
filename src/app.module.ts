import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { DatabaseModule } from './database/database.module';
import { LoginModule } from './login/login.module';
import { FeedController } from './feed/feed.controller';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [DatabaseModule, LoginModule, FeedModule],
  controllers: [AppController, HealthController, FeedController],
  providers: [AppService],
})
export class AppModule {}
