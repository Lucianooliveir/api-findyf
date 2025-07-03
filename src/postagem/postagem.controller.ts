import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
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
import { Comentario } from './models/comentario.entity';
import { CreatePostagemDto } from './models/create-postagem.dto';

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

  @Post('/criarPostagem')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async CriarPostagem(
    @Body() dto: CreatePostagemDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.postagemService.criarPostagem(dto, file);
      res.statusMessage = 'Postagem criada com sucesso';
      res.status(HttpStatus.OK).send();
      return;
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.statusMessage = 'Usuário não encontrado';
        res.status(HttpStatus.NOT_FOUND).send();
        return;
      }
      if (error.message === 'Animal not found') {
        res.statusMessage = 'Animal não encontrado';
        res.status(HttpStatus.NOT_FOUND).send();
        return;
      }
      res.statusMessage = 'Erro interno do servidor';
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      return;
    }
  }

  @UseGuards(AuthGuard)
  @Get('/getPostagensByUser')
  async todasPostagens(@Query() query: { id?: string }) {
    console.log(query.id);
    const idNumber = query.id !== undefined ? Number(query.id) : undefined;
    const resp = await this.postagemService.getPostagensById(
      idNumber as number,
    );
    resp.map((e) => (e.user_infos.senha = ''));
    console.log(resp);
    return resp;
  }

  @UseGuards(AuthGuard)
  @Get('/getPostagens')
  async getPostagens() {
    const resp = await this.postagemService.getPostagens();
    return resp;
  }

  @UseGuards(AuthGuard)
  @Post('/curtir')
  async curtir(@Body() like: Likes) {
    console.log(like);
    await this.postagemService.curtir(like);
  }

  @UseGuards(AuthGuard)
  @Post('/comentar')
  async comentar(@Body() comentario) {
    console.log(comentario);
    await this.postagemService.comentar(comentario);
  }
}
