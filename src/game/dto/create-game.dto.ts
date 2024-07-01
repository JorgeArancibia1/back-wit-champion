import { IsString, MinLength } from 'class-validator';
import { Team } from '../interfaces';

export class CreateGameDto {
  @IsString()
  place: string;
  @IsString()
  @MinLength(1)
  day: string;
  @IsString()
  @MinLength(1)
  month: string;
  @IsString()
  hour: string;
  // @IsString()
  teamA: Team;
  // @IsString()
  teamB: Team;
}
