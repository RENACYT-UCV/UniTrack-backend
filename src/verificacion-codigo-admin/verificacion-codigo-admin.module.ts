import { Module } from '@nestjs/common';
import { VerificacionCodigoAdminController } from './verificacion-codigo-admin.controller';
import { VerificacionCodigoAdminService } from './verificacion-codigo-admin.service';

@Module({
  controllers: [VerificacionCodigoAdminController],
  providers: [VerificacionCodigoAdminService],
})
export class VerificacionCodigoAdminModule {}
