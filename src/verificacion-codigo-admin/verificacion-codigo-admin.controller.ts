import { CreateVerificacionCodigoAdminDto } from './dto/createVerificacion-codigo-admin.dto';
import { UpdateVerificacionCodigoAdminDto } from './dto/updateVerificacion-codigo-admin.dto';
import { VerificacionCodigoAdminService } from './verificacion-codigo-admin.service';
import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';

@Controller('verificacion-codigo-admin')
export class VerificacionCodigoAdminController {
  constructor(private readonly verificacionAdminService: VerificacionCodigoAdminService) {}

  @Post()
  crear(@Body() dto: CreateVerificacionCodigoAdminDto) {
    return this.verificacionAdminService.crear(dto);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateVerificacionCodigoAdminDto) {
    return this.verificacionAdminService.actualizar(+id, dto);
  }

  @Get('admin/:idAdmin')
  obtenerPorAdmin(@Param('idAdmin') idAdmin: string) {
    return this.verificacionAdminService.encontrarPorAdmin(+idAdmin);
  }
}