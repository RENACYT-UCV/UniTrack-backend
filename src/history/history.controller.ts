import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Controller('historial')
export class HistoryController {
  constructor(private readonly HistoryService: HistoryService) {}

  @Get('')
  async historial() {
    return this.HistoryService.findAll();
  }

  @Get('historial/:idUsuario')
  async historialfindByID(@Param('idUsuario') idUsuario: string) {
    return await this.HistoryService.findByUserId(+idUsuario);
  }

  @Post('crear')
  async crear(@Body() dto: CreateHistoryDto) {
    return await this.HistoryService.create(dto);
  }

  @Get('entradas')
  async entradas() {
    const filter = this.HistoryService.findEntradas().then((value) =>
      value.filter((value) => value.modo === 'Ingreso'),
    );
    return await filter;
  }

  @Get('salidas')
  async salidas() {
    const filter = this.HistoryService.findEntradas().then((value) =>
      value.filter((value) => value.modo === 'Salida'),
    );
    return await filter;
  }
}
