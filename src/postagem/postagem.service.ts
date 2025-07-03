import { Inject, Injectable } from '@nestjs/common';
import { Postagem } from './models/post.entity';
import { Repository, IsNull } from 'typeorm';
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
    postagem.imagem_post = file.path;
    postagem.data = new Date(Date.now());
    const response = await this.postagemRepository.insert(postagem);
    return response;
  }

  async getPostagensById(id: number) {
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

  async getPostagens() {
    const response = await this.postagemRepository
      .createQueryBuilder('postagem')
      .leftJoinAndSelect('postagem.user_infos', 'user_infos')
      .leftJoinAndSelect('user_infos.postagens', 'user_postagens')
      .leftJoinAndSelect('user_infos.curtidos', 'user_curtidos')
      .leftJoinAndSelect('user_curtidos.post_infos', 'curtidos_posts')
      .leftJoinAndSelect('postagem.curtidas', 'curtidas')
      .leftJoinAndSelect('curtidas.user_infos', 'curtidas_user')
      .leftJoinAndSelect(
        'postagem.comentarios',
        'comentarios',
        'comentarios.responde IS NULL',
      )
      .leftJoinAndSelect('comentarios.autor', 'comentarios_autor')
      .leftJoinAndSelect('comentarios.respostas', 'respostas')
      .leftJoinAndSelect('respostas.autor', 'respostas_autor')
      .orderBy('postagem.data', 'DESC')
      .getMany();

    return response;
  }

  async curtir(like) {
    console.log('Looking for like:', like.post_infos?.id, like.user_infos?.id);

    const existingLike = await this.likesRepository.findOne({
      where: {
        post_infos: { id: like.post_infos },
        user_infos: { id: like.user_infos },
      },
    });

    console.log('Existing like:', existingLike);

    if (!existingLike) {
      return await this.likesRepository.insert(like);
    } else {
      return await this.likesRepository.delete({
        post_infos: { id: like.post_infos },
        user_infos: { id: like.user_infos },
      });
    }
  }

  async comentar(comentario: Comentario) {
    const response = await this.comentarioRepository.insert(comentario);
    return response;
  }
}
