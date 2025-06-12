import { Module } from '@nestjs/common';
import { envConfig } from '@config/env.config';
import { typeOrmModule } from '@config/database.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { AlertasModule } from './alertas/alertas.module';
import { VerificacionCodigoModule } from './verificacion-codigo/verificacion-codigo.module';
import { VerificacionCodigoAdminService } from './verificacion-codigo-admin/verificacion-codigo-admin.service';
import { VerificacionCodigoAdminModule } from './verificacion-codigo-admin/verificacion-codigo-admin.module';
import { ReportHistoryModule } from './report-history/report-history.module';
import { HistoryModule } from './history/history.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [
    envConfig(),
    typeOrmModule(),
    UsersModule,
    AuthModule,
    ReportHistoryModule,
    HistoryModule,
    QrModule,
    AdminModule,
    ReportsModule,
    AlertasModule,
    VerificacionCodigoModule,
    VerificacionCodigoAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, VerificacionCodigoAdminService],
})
export class AppModule {}
