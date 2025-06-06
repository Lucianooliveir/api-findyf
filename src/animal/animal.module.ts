import { Module } from '@nestjs/common';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { animalProviders } from './animal.providers';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  controllers: [AnimalController],
  providers: [AnimalService, ...animalProviders, ...databaseProviders],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/animais',
        filename(req, file, callback) {
          const filename = Date.now() + '.jpg';
          callback(null, filename);
        },
      }),
    }),
  ],
})
export class AnimalModule {}
