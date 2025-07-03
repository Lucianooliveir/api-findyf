import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './models/create-evento.dto';
import { AuthGuard } from 'src/login/login.guard';
import { Response } from 'express';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post('/createEvento')
  @UseGuards(AuthGuard)
  async createEvento(@Body() dto: CreateEventoDto, @Res() res: Response) {
    try {
      const evento = await this.eventosService.createEvento(dto);
      res.status(HttpStatus.CREATED).json({
        message: 'Evento criado com sucesso',
        evento: evento,
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno do servidor',
        error: error.message,
      });
    }
  }

  @Get('/getEvento/:id')
  async getEventoById(@Param('id') id: number, @Res() res: Response) {
    try {
      const evento = await this.eventosService.getEventoById(id);

      if (!evento) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: 'Evento não encontrado',
        });
        return;
      }

      res.status(HttpStatus.OK).json(evento);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno do servidor',
        error: error.message,
      });
    }
  }

  @Get('/getEventosByAbrigo/:abrigoId')
  async getEventosByAbrigoId(
    @Param('abrigoId') abrigoId: number,
    @Res() res: Response,
  ) {
    try {
      const eventos = await this.eventosService.getEventosByAbrigoId(abrigoId);

      if (!eventos || eventos.length === 0) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhum evento encontrado para este abrigo',
        });
        return;
      }

      res.status(HttpStatus.OK).json(eventos);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro interno do servidor',
        error: error.message,
      });
    }
  }
}
