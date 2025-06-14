import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';
import { QR } from './entities/qr.entity';
import { GoogleDriveModule } from '../google-drive/google-drive.module';

@Module({
  imports: [TypeOrmModule.forFeature([QR]), GoogleDriveModule],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {}
