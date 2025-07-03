export class CreateEventoDto {
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  preco: string;
  horario: string;
  abrigoId?: number; // Optional - only for shelters
}
