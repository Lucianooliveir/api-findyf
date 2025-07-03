import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Abrigo } from './models/abrigo.entity';

@Injectable()
export class LoginService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ABRIGO_REPOSITORY')
    private abrigoRepository: Repository<Abrigo>,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async cadastro(
    user: User,
    file: Express.Multer.File,
  ): Promise<{ access_token: string; user: User } | null> {
    if ((await this.userRepository.findOneBy({ email: user.email })) != null) {
      return null;
    }
    user.senha = await bcrypt.hash(user.senha, 10);
    user.imagem_perfil = file.path;
    await this.userRepository.insert(user);

    const created = await this.userRepository.findOne({
      where: { email: user.email },
      relations: ['curtidos', 'curtidos.post_infos', 'postagens'],
    });

    if (created === null) {
      return null;
    }

    const payload = { sub: created?.id, username: created?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: created,
    };
  }

  async login(
    email: string,
    senha: string,
  ): Promise<{ access_token: string; user: User } | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['curtidos', 'curtidos.post_infos', 'postagens'],
    });

    if (user === null) {
      return null;
    }

    const isMatch = await bcrypt.compare(senha, user?.senha);
    if (!isMatch) {
      return null;
    }

    const payload = { sub: user?.id, username: user?.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async cadastrarAbrigo(abrigo: Abrigo): Promise<Abrigo | null> {
    if (
      (await this.abrigoRepository.findOneBy({
        crmv_responsavel: abrigo.crmv_responsavel,
      })) != null
    ) {
      return null;
    }
    await this.abrigoRepository.insert(abrigo);
    const created = await this.abrigoRepository.findOneBy({
      crmv_responsavel: abrigo.crmv_responsavel,
    });
    return created;
  }
}
