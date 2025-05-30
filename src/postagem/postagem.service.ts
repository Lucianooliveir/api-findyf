import { Inject, Injectable } from '@nestjs/common';
import { Postagem } from './models/post.entity';
import { Repository } from 'typeorm';
import { Likes } from './models/like.entity';

@Injectable()
export class PostagemService {
  constructor(
    @Inject('POSTAGEM_REPOSITORY')
    private postagemRepository: Repository<Postagem>,
    @Inject('LIKES_REPOSITORY')
    private likesRepository: Repository<Likes>,
  ) {}

  async postar(postagem: Postagem, file: Express.Multer.File) {
    console.log(file.path);
    postagem.imagem_post = file.path;
    postagem.data = new Date(Date.now());
    const response = await this.postagemRepository.insert(postagem);
    return response;
  }

  async getPostagens() {
    const response = await this.postagemRepository.find({
      relations: ['user_infos', 'curtidas'],
    });

    return response;
  }

  async curtir(like: Likes) {
    console.log(like);
    const response = await this.likesRepository.insert(like);
    console.log(response);
    return response;
  }
}
