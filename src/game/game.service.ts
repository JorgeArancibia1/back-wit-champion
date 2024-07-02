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
  ) {
    super();
  }

  async create(createGameDto: CreateGameDto) {
    // Validaciones
    createGameDto.place = createGameDto.place.toLowerCase();
    // const { teamA, teamB, ...rest } = createGameDto;

    try {
      // Se crea en BD
      console.log(createGameDto.month);
      // const newGame = await this.gameModel.create({
      //   place: createGameDto.place,
      //   day: createGameDto.day,
      //   hour: createGameDto.hour,
      //   month: createGameDto.month,
      //   teamA: createGameDto.teamA,
      //   teamB: createGameDto.teamB,
      // });
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

  findAll() {
    return `This action returns all game`;
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

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
