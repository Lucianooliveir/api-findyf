import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { User } from './user.entity';
import { AuthGuard } from './login.guard';
import { Response } from 'express';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.loginService.findAll();
  }

  @Post('/cadastro')
  async cadastro(@Body() user: User, @Res() res: Response) {
    try {
      const access_token = await this.loginService.cadastro(user);
      if (access_token === null) {
        res.statusMessage = 'Usuário ja existente';
        res.status(HttpStatus.CONFLICT).send();
        return;
      }
      res.send({ token: access_token?.access_token });
      res.status(HttpStatus.OK).send();
      return;
    } catch {
      res.send({ Erro: 'Erro de validacao' });
      res.status(HttpStatus.BAD_REQUEST).send();
      return;
    }
  }

  @Post('/login')
  async login(@Body() login: Record<string, any>, @Res() res: Response) {
    if (login.email === undefined && login.senha === undefined) {
      res.statusMessage = 'Email ou senha invalidos';
      res.status(HttpStatus.BAD_REQUEST).send();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = await this.loginService.login(login.email, login.senha);

    if (token === null) {
      res.statusMessage = 'Usuário não encontrado';
      res.status(HttpStatus.NOT_FOUND).send();
      return;
    }
    res.send({ token: token?.access_token });
    res.status(HttpStatus.OK).send();
    return;
  }
}
