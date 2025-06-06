import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/login/login.guard';
import { AnimalService } from './animal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Animal } from './models/animal.entity';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/createAnimal')
  async createAnimal(
    @Body() animal: Animal,
    @Res() res: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.animalService.createAnimal(animal, file);
      return res.status(HttpStatus.CREATED).json({
        message: 'Animal criado',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao criar animal',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/getAnimaisByUserId')
  async getAnimaisByUserId(@Body('userId') userId: number, @Res() res: any) {
    try {
      const animais = await this.animalService.getAnimaisByUserId(userId);
      if (!animais || animais.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhum animal encontrado para este usuário',
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return res.status(HttpStatus.OK).json(animais);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao buscar animais',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        error: error.message,
      });
    }
  }
}
