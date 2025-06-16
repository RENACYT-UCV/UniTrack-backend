import { Module } from '@nestjs/common';
import { envConfig } from '@config/env.config';
import { typeOrmModule } from '@config/database.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { ReportHistoryModule } from './report-history/report-history.module';
import { HistoryModule } from './history/history.module';
import { QrModule } from './qr/qr.module';
import { BlockchainController } from './blockchain/blockchain.controller';
import { BlockchainModule } from './blockchain/blockchain.module';
import { JwtModule } from '@nestjs/jwt';

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
    MailModule,
    ReportsModule,
    BlockchainModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
