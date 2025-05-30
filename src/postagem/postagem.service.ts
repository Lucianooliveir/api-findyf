import { Inject, Injectable } from '@nestjs/common';
import { Postagem } from './models/post.entity';
import { QueryResult, Repository } from 'typeorm';
import { Likes } from './models/like.entity';
import { Comentario } from './models/comentario.entity';

@Injectable()
export class PostagemService {
  constructor(
    @Inject('POSTAGEM_REPOSITORY')
    private postagemRepository: Repository<Postagem>,
    @Inject('LIKES_REPOSITORY')
    private likesRepository: Repository<Likes>,
    @Inject('COMENTARIO_REPOSITORY')
    private comentarioRepository: Repository<Comentario>,
  ) {}

  async postar(postagem: Postagem, file: Express.Multer.File) {
    console.log(file.path);
    postagem.imagem_post = file.path;
    postagem.data = new Date(Date.now());
    const response = await this.postagemRepository.insert(postagem);
    return response;
  }

  async getPostagens(id: number) {
    const response = await this.postagemRepository.find({
      relations: ['user_infos', 'curtidas'],
      where: {
        user_infos: {
          id: id,
        },
      },
    });

    return response;
  }

  async curtir(like: Likes) {
    console.log(like);
    let response: any;
    if (
      (await this.likesRepository.findOneBy({
        user_infos: like.user_infos,
      })) === null
    ) {
      response = await this.likesRepository.insert(like);
    } else {
      response = await this.likesRepository.delete(like);
    }
    return response;
  }

  async comentar(comentario: Comentario) {
    console.log(comentario);
    const response = await this.comentarioRepository.insert(comentario);
    return response;
  }
}
