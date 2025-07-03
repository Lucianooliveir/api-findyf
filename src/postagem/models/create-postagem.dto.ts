export class CreatePostagemDto {
  texto: string;
  user_infos: number; // User ID
  animal?: number; // Animal ID (optional - only for shelters)
}
