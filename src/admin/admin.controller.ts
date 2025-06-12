import { Controller, Post, Put, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './entities/dto/create-admin.dto';
import { UpdateAdminDto } from './entities/dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<{ message: string }> {
    return this.adminService.create(createAdminDto);
  }

  @Put(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<{ message?: string; error?: string }> {
    return this.adminService.update(+id, updateAdminDto);
  }
}
