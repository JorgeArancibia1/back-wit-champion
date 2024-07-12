import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrismaClient } from '@prisma/client';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('MongoDB connected');
  }
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<GameService>,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async create(createGameDto: CreateGameDto) {
    // Validaciones
    createGameDto.place = createGameDto.place.toLowerCase();

    try {
      const game = await this.gameModel.create(createGameDto);
      return game;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error(
          `El partido ya existe Error: ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `No se pudo crear el juego - CHECKEAR LOGS`,
      );
    }
  }

  async findAll() {
    return await this.gameModel.find();
  }

  async update(term: string, updateGameDto: UpdateGameDto) {
    const game = await this.findOneGameByMonth(term);
    if (updateGameDto.day) {
      updateGameDto.day = updateGameDto.day.toLowerCase();
    }

    //Traer Game
    // await game.updateOne(updateGameDto);

    return { ...game, ...updateGameDto };
  }

  remove(id: string) {
    return `This action removes a #${id} game`;
  }

  // PRISMA SERVICES
  async createPrismaGame(createGameDto: CreateGameDto) {
    // Validaciones
    createGameDto.place = createGameDto.place.toUpperCase();

    try {
      const game = await this.prisma.game.create({
        data: createGameDto,
      });

      return game;
    } catch (error) {
      if (error.code === 'P2002') {
        // Error de violación de restricción única
        throw new Error(
          `El partido ya existe Error: ${JSON.stringify(error.meta)}`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        `No se pudo crear el juego - CHECKEAR LOGS`,
      );
    }
  }

  async findAllGames() {
    return this.prisma.game.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOneGameByMonth(term: string) {
    console.log('TERM => ', term); // Agosto
    const foundGame = await this.prisma.game.findMany({
      where: {
        month: {
          equals: 'Agosto',
        },
      },
    });

    console.log(foundGame);

    if (foundGame.length === 0) {
      throw new NotFoundException(`Juego por mes de ${term} no encontrado`);
    }

    return foundGame;
  }

  async updateGame(id: string, updateGameDto: UpdateGameDto) {
    try {
      const game = await this.prisma.game.update({
        where: { id },
        data: updateGameDto,
      });
      return game;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Juego con ID ${id} no encontrado`);
      }
      console.log(error);
      throw new InternalServerErrorException(
        `No se pudo actualizar el juego - CHECKEAR LOGS`,
      );
    }
  }

  async removeGame(id: string) {
    try {
      await this.prisma.game.delete({ where: { id } });
      return { message: `Juego con ID ${id} eliminado` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Juego con ID ${id} no encontrado`);
      }
      console.log(error);
      throw new InternalServerErrorException(
        `No se pudo eliminar el juego - CHECKEAR LOGS`,
      );
    }
  }

  // Crea solo si el registro no existe
  // async createUniqueGame(createGameDto: CreateGameDto) {
  //   const upsertedGame = await prisma.game.upsert({
  //     where: { day: day },
  //     create: { name: 'John Doe', email: 'email@example.com' },
  //     update: { name: 'John Doe' },
  //   });
  //   return upsertedGame;
  // }
}
