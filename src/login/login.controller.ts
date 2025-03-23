import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { User } from './user.entity';
import { InsertResult } from 'typeorm';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return await this.loginService.findAll();
  }

  @Post('/cadastro')
  cadastro(@Body() user: User): Promise<InsertResult> {
    return this.loginService.cadastro(user);
  }
}
