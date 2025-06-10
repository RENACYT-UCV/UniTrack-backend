import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QrModule } from './qr/qr.module';
import { HistorialModule } from './historial/historial.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, AuthModule, QrModule, HistorialModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
