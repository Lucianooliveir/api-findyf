import { Module } from '@nestjs/common';
import { PostagemController } from './postagem.controller';
import { PostagemService } from './postagem.service';
import { postagemProviders } from './postagem.providers';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  controllers: [PostagemController],
  providers: [PostagemService, ...postagemProviders, ...databaseProviders],
})
export class PostagemModule {}
