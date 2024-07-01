import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Team } from '../interfaces';

@Schema()
export class Game extends Document {
  place: string;
  @Prop({
    index: true,
  })
  day: string;
  month: string;
  hour: string;
  @Prop({
    // unique: true,
  })
  teamA: Team;
  @Prop({
    // unique: true,
  })
  teamB: Team;
  // Teams: string[];
  // players: string[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
