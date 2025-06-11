import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './entities/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './entities/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      contrasena: hashedPassword,
    });
    await this.userRepository.save(user);
    return { message: 'Usuario creado correctamente' };
  }

  async findAll(): Promise<
    Array<{
      idUsuario: number;
      nombres: string;
      apellidos: string;
      correo: string;
      codigoEstudiante: string;
    }>
  > {
    const users = await this.userRepository.find({
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
      ],
    });
    return users;
  }

  async findByCorreo(correo: string) {
    const user = await this.userRepository.findOne({
      where: { correo },
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
        'correoA',
        'carrera',
        'ciclo',
        'edad',
        'sexo',
      ],
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    return user;
  }

  async login(correo: string, contrasena: string) {
    const user = await this.userRepository.findOne({
      where: { correo },
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
        'contrasena',
        'correoA',
        'carrera',
        'ciclo',
        'edad',
        'sexo',
      ],
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return { error: 'Contraseña incorrecta' };
    }
    // No enviar la contraseña en la respuesta
    const { contrasena: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message?: string; error?: string }> {
    const user = await this.userRepository.findOne({
      where: { idUsuario: id },
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    await this.userRepository.update(id, updateUserDto);
    return { message: 'Usuario actualizado correctamente' };
  }

  async remove(id: number): Promise<{ message?: string; error?: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return { message: 'Usuario eliminado correctamente' };
    } else {
      return { error: 'Error al eliminar usuario' };
    }
  }
}
