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
import { Postagem } from './models/post.entity';
import { PostagemService } from './postagem.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Likes } from './models/like.entity';

@Controller('postagem')
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}
  @Post('/postar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async Postar(
    @Body() postagem: Postagem,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.postagemService.postar(postagem, file);
    res.statusMessage = 'postado com sucesso';
    res.status(HttpStatus.OK).send();
    return;
  }

  @UseGuards(AuthGuard)
  @Get('/getPostagens')
  async todasPostagens() {
    const resp = await this.postagemService.getPostagens();
    resp.map((e) => (e.user_infos.senha = ''));
    console.log(resp);
    return resp;
  }

  @UseGuards(AuthGuard)
  @Post('/curtir')
  async curtir(@Body() like: Likes) {
    console.log(like);
    await this.postagemService.curtir(like);
  }
}
