import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Evento } from './models/evento.entity';
import { CreateEventoDto } from './models/create-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @Inject('EVENTO_REPOSITORY')
    private eventoRepository: Repository<Evento>,
  ) {}

  async createEvento(dto: CreateEventoDto): Promise<Evento> {
    const evento = new Evento();
    evento.nome = dto.nome;
    evento.descricao = dto.descricao;
    evento.dataInicio = dto.dataInicio;
    evento.dataFim = dto.dataFim;
    evento.preco = dto.preco;
    evento.horario = dto.horario;
    evento.abrigoId = dto.abrigoId || null;

    await this.eventoRepository.insert(evento);
    return evento;
  }

  async getEventoById(id: number): Promise<Evento | null> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: ['abrigo'],
    });
    return evento;
  }

  async getEventosByAbrigoId(abrigoId: number): Promise<Evento[]> {
    const eventos = await this.eventoRepository.find({
      where: { abrigoId },
      relations: ['abrigo'],
      order: { dataInicio: 'DESC' },
    });
    return eventos;
  }
}
