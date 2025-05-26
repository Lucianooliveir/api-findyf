import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/login/login.guard';
import { Postagem } from './models/post.entity';
import { PostagemService } from './postagem.service';

@Controller('postagem')
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}
  @Post('/postar')
  @UseGuards(AuthGuard)
  async Postar(@Body() postagem: Postagem, @Res() res: Response) {
    return await this.postagemService.postar(postagem);
  }

  @UseGuards(AuthGuard)
  @Get('/getPostagens')
  async todasPostagens() {
    const resp = await this.postagemService.getPostagens();
    resp.map((e) => (e.user_infos.senha = ''));
    return resp;
  }
}
