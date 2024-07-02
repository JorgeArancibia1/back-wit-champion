import { Prop } from '@nestjs/mongoose';
import { IsString, MinLength } from 'class-validator';

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
  @Prop({ required: true })
  teamA: string[];
  // @IsString()
  @Prop({ required: true })
  teamB: string[];
}
