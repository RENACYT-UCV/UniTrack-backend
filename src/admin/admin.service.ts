import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './entities/dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './entities/dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<{ message: string }> {
    const hashedPassword = await bcrypt.hash(createAdminDto.contrasena, 10);
    const admin = this.adminRepository.create({
      ...createAdminDto,
      contrasena: hashedPassword,
    });
    await this.adminRepository.save(admin);
    return { message: 'Administrador creado correctamente' };
  }

  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<{ message?: string; error?: string }> {
    const admin = await this.adminRepository.preload({
      idAdmin: id,
      ...updateAdminDto,
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    await this.adminRepository.save(admin);
    return { message: 'Usuario actualizado correctamente' };
  }
}
