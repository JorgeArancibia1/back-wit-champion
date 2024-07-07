import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PrismaClient } from '@prisma/client';
import { Model, isValidObjectId } from 'mongoose';
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

  async findOne(term: string) {
    console.log('TERM => ', term);
    let game: Game;

    //Si es un número se hace la evaluación
    if (!isNaN(+term)) {
      // game = await this.gameService.findOne({
      //   id: term,
      // });
    }
    // Validacion de Mongo ID
    if (!game && isValidObjectId(term)) {
      // game = await this.gameService.findById(term);
    }

    // Buscar por nombre
    if (!game) {
      // game = await this.gameService.findOne({
      //   month: term.toLowerCase().trim(),
      // });
    }

    if (!game) {
      throw new NotFoundException(
        `Game with id, day or place no ${term} not found`,
      );
    }
    return game;
  }

  async update(term: string, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(term);
    if (updateGameDto.day) {
      updateGameDto.day = updateGameDto.day.toLowerCase();
    }

    //Traer Game
    await game.updateOne(updateGameDto);

    return { ...game.toJSON(), ...updateGameDto };
  }

  remove(id: string) {
    return `This action removes a #${id} game`;
  }

  async createPrismaGame(createGameDto: CreateGameDto) {
    // Validaciones
    createGameDto.place = createGameDto.place.toLowerCase();

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
    return this.prisma.game.findMany();
  }
}
