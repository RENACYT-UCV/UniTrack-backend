import { Module } from '@nestjs/common';
import { VerificacionCodigoAdminController } from './verificacion-codigo-admin.controller';

@Module({
  controllers: [VerificacionCodigoAdminController],
})
export class VerificacionCodigoAdminModule {}
