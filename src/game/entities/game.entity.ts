import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Game extends Document {
  @Prop({
    index: true,
  })
  place: string;
  @Prop({
    index: true,
  })
  day: string;
  @Prop({
    index: true,
  })
  month: string;
  @Prop({
    index: true,
  })
  hour: string;
  @Prop({
    index: true,
    required: true,
  })
  teamA: string[];
  @Prop({
    index: true,
    required: true,
  })
  teamB: string[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
