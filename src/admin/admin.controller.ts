import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login-admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
    type: Admin,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateAdminDto })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all admins' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all admins.',
    type: [Admin],
  })
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an admin by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin to retrieve',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved admin.',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin to update',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The admin has been successfully updated.',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @ApiBody({ type: UpdateAdminDto })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin to delete',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The admin has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login an admin' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in.',
    type: Admin,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginAdminDto })
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }
}
