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
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';
import { ForgotPasswordDto } from 'src/users/dto/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AdminService {
  private passwordResetCodes: Map<string, { code: string; expiry: Date }> =
    new Map();

  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    private mailService: MailService,
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
        access_token,
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

  async login(
    loginAdminDto: LoginAdminDto,
  ): Promise<{ access_token: string; current_user }> {
    const admin = await this.adminRepository.findOne({
      where: { correo: loginAdminDto.correo },
    });
    if (!admin) {
      throw new NotFoundException(
        `Admin with correo ${loginAdminDto.correo} not found`,
      );
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

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message?: string; error?: string }> {
    const { correo } = forgotPasswordDto;
    const user = await this.adminRepository.findOne({ where: { correo } });

    if (!user) {
      return { error: 'Administrador no encontrado' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Code valid for 10 minutes
    this.passwordResetCodes.set(correo, { code, expiry });

    const subject = 'Restablecimiento de Contraseña';
    const text = `Su código de restablecimiento de contraseña es: ${code}. Este código es válido por 10 minutos.`;
    const html = `<p>Su código de restablecimiento de contraseña es: <strong>${code}</strong>. Este código es válido por 10 minutos.</p>`;
    try {
      await this.mailService.sendMail(forgotPasswordDto.correo, subject, text, html);
      return {
        message: `Código de restablecimiento enviado a su correo. ${code}`,
      };
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      return { error: 'Error al enviar el correo de restablecimiento.' };
    }
  }

  async verifyToken(email: string, code: number) {
    const storedCode = this.passwordResetCodes.get(email);
    if (!storedCode) {
      return { error: 'Código no encontrado o expirado.' };
    }

    if (new Date() > storedCode.expiry) {
      this.passwordResetCodes.delete(email);
      return { error: 'Código expirado.' };
    }

    // compare the provided code with the stored code
    if (storedCode.code !== code.toString()) {
      return { error: 'Código inválido.' };
    }
    // If the code is valid, return a success message
    this.passwordResetCodes.delete(email);

    return { message: 'Código verificado correctamente.' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message?: string; error?: string }> {
    const { correo, code, newPassword } = resetPasswordDto;
    const storedCode = this.passwordResetCodes.get(correo);

    if (!storedCode || storedCode.code !== code) {
      return { error: 'Código inválido o expirado.' };
    }

    if (new Date() > storedCode.expiry) {
      this.passwordResetCodes.delete(correo); // Remove expired code
      return { error: 'Código expirado.' };
    }

    const admin = await this.adminRepository.findOne({ where: { correo } });
    if (!admin) {
      return { error: 'Administrador no encontrado.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.adminRepository.update(admin.idAdmin, {
      contrasena: hashedPassword,
    });
    this.passwordResetCodes.delete(correo); // Invalidate code after successful reset

    return { message: 'Contraseña actualizada correctamente.' };
  }
}
