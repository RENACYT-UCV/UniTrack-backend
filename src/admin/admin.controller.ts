import { Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async createAdmin() {
    return null;
  }

  @Post()
  async updateAdmin() {
    return null;
  }
}
