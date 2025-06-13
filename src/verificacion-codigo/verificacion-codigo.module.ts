import { Module } from '@nestjs/common';
import { VerificacionCodigoController } from './verificacion-codigo.controller';
import { VerificacionCodigoService } from './verificacion-codigo.service';

@Module({
  controllers: [VerificacionCodigoController],
  providers: [VerificacionCodigoService],
})
export class VerificacionCodigoModule {}
