import { Injectable } from '@nestjs/common';
import { CreateVerificacionCodigoAdminDto } from './dto/createVerificacion-codigo-admin.dto';
import { UpdateVerificacionCodigoAdminDto } from './dto/updateVerificacion-codigo-admin.dto';

@Injectable()
export class VerificacionCodigoAdminService {
    crear(dto: CreateVerificacionCodigoAdminDto) {
        return 'This action adds a new verificacionCodigoAdmin';
      }

      actualizar(id: number, dto: UpdateVerificacionCodigoAdminDto) {
        return 'This action updates a #${id} verificacionCodigoAdmin';
      }

      eliminar(id: number) {
        return 'This action removes a #${id} verificacionCodigoAdmin';
      }

      encontrarPorAdmin(idAdmin: number) {
        return 'This action returns a #${idAdmin} verificacionCodigoAdmin';
      }
}
