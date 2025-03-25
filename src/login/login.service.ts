import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async cadastro(user: User): Promise<{ access_token: string } | null> {
    console.log(await this.userRepository.findOneBy({ email: user.email }));
    if ((await this.userRepository.findOneBy({ email: user.email })) != null) {
      return null;
    }
    await this.userRepository.insert(user);
    const created = await this.userRepository.findOneBy({ email: user.email });

    const payload = { sub: created?.id, username: created?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(
    email: string,
    senha: string,
  ): Promise<{ access_token: string } | null> {
    const user = await this.userRepository.findOneBy({
      email: email,
      senha: senha,
    });

    if (user === null) {
      return null;
    }

    const payload = { sub: user?.id, username: user?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
