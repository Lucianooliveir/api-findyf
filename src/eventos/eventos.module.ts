import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';
import { eventosProviders } from './eventos.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EventosController],
  providers: [EventosService, ...eventosProviders],
  exports: [EventosService],
})
export class EventosModule {}
