import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './entities/dto/create-admin.dto';
import { UpdateAdminDto } from './entities/dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async createAdmin(@Body() admin: CreateAdminDto) {
    return null;
  }

  @Post()
  async updateAdmin(@Body() admin: UpdateAdminDto) {
    return null;
  }
}
