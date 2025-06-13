import { Module } from '@nestjs/common';
import { PostagemController } from './postagem.controller';
import { PostagemService } from './postagem.service';
import {
  comentarioProviders,
  likesProviders,
  postagemProviders,
} from './postagem.providers';
import { databaseProviders } from 'src/database/database.providers';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [PostagemController],
  providers: [
    PostagemService,
    ...postagemProviders,
    ...databaseProviders,
    ...likesProviders,
    ...comentarioProviders,
  ],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/posts',
        filename(req, file, callback) {
          const filename = Date.now() + '.jpg';
          callback(null, filename);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  ],
})
export class PostagemModule {}
