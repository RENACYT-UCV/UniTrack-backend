import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { VerificacionCodigoService } from './verificacion-codigo.service';
import { UpdateVerificacionCodigoDto } from './dto/updateVerificacion.codigo.dto';
import { CreateVerificacionCodigoDto } from './dto/createVerificacion-codigo.dto';


@Controller('verificacion-codigo')
export class VerificacionCodigoController {
  constructor(private readonly verificacionService: VerificacionCodigoService) {}

  @Post()
  crear(@Body() dto: CreateVerificacionCodigoDto) {
    return this.verificacionService.crear(dto);
  }

  @Put(':id')
  actualizar(@Param('id') id: string, @Body() dto: UpdateVerificacionCodigoDto) {
    return this.verificacionService.actualizar(+id, dto);
  }

  @Get('usuario/:idUsuario')
  obtenerPorUsuario(@Param('idUsuario') idUsuario: string) {
    return this.verificacionService.encontrarPorUsuario(+idUsuario);
  }
}