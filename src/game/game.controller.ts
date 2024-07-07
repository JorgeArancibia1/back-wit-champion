import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.gameService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateGameDto: UpdateGameDto) {
    updateGameDto.month; // => Junio
    return this.gameService.update(term, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  // PRISMA CONTROLLERS
  @Post('/prisma')
  @HttpCode(HttpStatus.CREATED)
  async createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get('/prisma')
  async findAllGames() {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOneGame(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  async updateGame(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  async removeGame(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
