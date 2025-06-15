import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';

import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards, Request as Req } from '@nestjs/common';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()

  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()

  async findAll() {
    return this.usersService.findAll();
  }

  @Get('correo/:correo')

  async findByCorreo(@Param('correo') correo: string) {
    return this.usersService.findByCorreo(correo);
  }

  @UseGuards(AuthGuard)
  @Get('profile')

  async getProfile(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.findById(userId);
  }

  @Delete(':id')

  async remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Post('login')

  async login(@Body() body: { correo: string; contrasena: string }) {
    return this.usersService.login(body.correo, body.contrasena);
  }

  @Put(':id')

  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }
}
