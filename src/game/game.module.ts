import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'src/prisma.module';
import { GameSchema } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }]),
    PrismaModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
