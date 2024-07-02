import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config';
import { GameModule } from './game/game.module';

@Module({
  imports: [MongooseModule.forRoot(envs.databaseUrl), GameModule],
})
export class AppModule {}
