import { IsArray, IsString, MinLength } from 'class-validator';

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
  // @IsString({ each: true })
  @IsArray({ each: true })
  teamA: string[];
  // @IsString()
  @IsArray({ each: true })
  teamB: string[];
}
