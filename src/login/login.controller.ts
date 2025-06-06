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
import { LoginService } from './login.service';
import { User } from './models/user.entity';
import { AuthGuard } from './login.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { loginEntity } from './models/login.entity';
import { Abrigo } from './models/abrigo.entity';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.loginService.findAll();
  }

  @Post('/cadastro')
  @UseInterceptors(FileInterceptor('file'))
  async cadastro(
    @Body() user: User,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const access_token = await this.loginService.cadastro(user, file);

      if (access_token === null) {
        res.statusMessage = 'Usuário ja existente';
        res.status(HttpStatus.CONFLICT).send();
        return;
      }

      access_token.user.senha = '';
      res.send({ token: access_token?.access_token, user: access_token.user });
      res.status(HttpStatus.OK).send();

      return;
    } catch (e) {
      console.log(e);
      res.send({ Erro: 'Erro de validacao' });
      res.status(HttpStatus.BAD_REQUEST).send();
      return;
    }
  }

  @Post('/login')
  async login(@Body() login: loginEntity, @Res() res: Response) {
    try {
      if (login.email === undefined && login.senha === undefined) {
        res.statusMessage = 'Email ou senha invalidos';
        res.status(HttpStatus.BAD_REQUEST).send();
        return;
      }
      const token = await this.loginService.login(login.email, login.senha);

      if (token === null) {
        res.statusMessage = 'Usuário não encontrado';
        res.status(HttpStatus.NOT_FOUND).send();
        return;
      }

      token.user.senha = '';
      res.send({ token: token?.access_token, userinfo: token.user });
      res.status(HttpStatus.OK).send();
      return;
    } catch {
      res.send({ Erro: 'Erro de validacao' });
      res.status(HttpStatus.BAD_REQUEST).send();
      return;
    }
  }

  @Post('/cadastrarAbrigo')
  @UseGuards(AuthGuard)
  async cadastrarAbrigo(@Body() abrigo: Abrigo, @Res() res: Response) {
    try {
      const abrigoCadastrado = await this.loginService.cadastrarAbrigo(abrigo);

      if (abrigoCadastrado === null) {
        res.statusMessage = 'Abrigo já existente';
        res.status(HttpStatus.CONFLICT).send();
        return;
      }

      res.send(abrigoCadastrado);
      res.status(HttpStatus.OK).send();
      return;
    } catch {
      res.send({ Erro: 'Erro de validacao' });
      res.status(HttpStatus.BAD_REQUEST).send();
      return;
    }
  }
}
