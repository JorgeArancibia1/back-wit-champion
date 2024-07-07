import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [MongooseModule.forRoot(envs.databaseUrl), GameModule, PrismaModule],
})
export class AppModule {}
