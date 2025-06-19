import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryFailedError } from 'typeorm';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async create(
    createAdminDto: CreateAdminDto,
  ): Promise<{ message?: string; error?: string; access_token?: string }> {
    const hashedPassword = await bcrypt.hash(createAdminDto.contrasena, 10);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      contrasena: hashedPassword,
    });
    try {
      const savedAdmin = await this.adminRepository.save(admin);
      const payload = { sub: savedAdmin.idAdmin, username: savedAdmin.correo };
      const access_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      return { 
        message: 'Administrador creado correctamente',
        access_token 
      };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError &&
        error.driverError.code === '23505'
      ) {
        if (error.driverError.detail.includes('correo')) {
          return { error: 'El correo ya está registrado.' };
        }
        return {
          error: 'Ya existe un administrador con los datos proporcionados.',
        };
      }
      throw error;
    }
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { idAdmin: id },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);
    this.adminRepository.merge(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  async remove(id: number): Promise<void> {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<{ access_token: string, current_user }> {
    const admin = await this.adminRepository.findOne({
      where: { correo: loginAdminDto.correo },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with correo ${loginAdminDto.correo} not found`);
    }
    const payload = { sub: admin.idAdmin, username: admin.correo };
    return {
      current_user: admin,
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
    };
  }
}
