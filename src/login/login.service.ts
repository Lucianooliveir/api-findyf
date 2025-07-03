import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Abrigo } from './models/abrigo.entity';
import { CreateAbrigoDto } from './models/abrigo.dto';

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
      relations: ['curtidos', 'curtidos.post_infos', 'postagens', 'abrigo'],
    });

    if (created === null) {
      return null;
    }

    const payload = { sub: created?.id, username: created?.email };

    // Add isShelter field to the user object
    created.isShelter = !!created.abrigo;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: created,
    };
  }

  async login(
    email: string,
    senha: string,
  ): Promise<{
    access_token: string;
    user: User;
  } | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['curtidos', 'curtidos.post_infos', 'postagens', 'abrigo'],
    });

    if (user === null) {
      return null;
    }

    const isMatch = await bcrypt.compare(senha, user?.senha);
    if (!isMatch) {
      return null;
    }

    const payload = { sub: user?.id, username: user?.email };

    // Add isShelter field to the user object
    user.isShelter = !!user.abrigo;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }

  async cadastrarAbrigo(abrigoDto: CreateAbrigoDto): Promise<Abrigo | null> {
    // Check if abrigo already exists
    if (
      (await this.abrigoRepository.findOneBy({
        crmv_responsavel: abrigoDto.crmv_responsavel,
      })) != null
    ) {
      return null;
    }

    // Find the user by ID
    const user = await this.userRepository.findOneBy({
      id: abrigoDto.user_infos,
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has an abrigo
    const existingAbrigo = await this.abrigoRepository.findOneBy({
      user_infos: { id: user.id },
    });

    if (existingAbrigo) {
      throw new Error('User already has an abrigo');
    }

    // Create the abrigo with the full user object
    const abrigo = new Abrigo();
    abrigo.nome_responsavel = abrigoDto.nome_responsavel;
    abrigo.crmv_responsavel = abrigoDto.crmv_responsavel;
    abrigo.telefone = abrigoDto.telefone;
    abrigo.user_infos = user;

    await this.abrigoRepository.insert(abrigo);

    const created = await this.abrigoRepository.findOne({
      where: { crmv_responsavel: abrigo.crmv_responsavel },
      relations: ['user_infos'],
    });

    return created;
  }
}
