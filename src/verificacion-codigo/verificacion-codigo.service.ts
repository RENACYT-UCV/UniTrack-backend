import { Injectable } from '@nestjs/common';
import { CreateVerificacionCodigoDto } from './dto/createVerificacion-codigo.dto';
import { UpdateVerificacionCodigoDto } from './dto/updateVerificacion.codigo.dto';

@Injectable()
export class VerificacionCodigoService {
    crear(dto: CreateVerificacionCodigoDto) {
        return 'This action adds a new verificacionCodigo';
      }

      actualizar(id: number, dto: UpdateVerificacionCodigoDto) {
        return 'This action updates a #${id} verificacionCodigo';
      }

      eliminar(id: number) {
        return 'This action removes a #${id} verificacionCodigo';
      }

      encontrarPorUsuario(idUsuario: number) {
        return 'This action returns a #${idUsuario} verificacionCodigo';
      }
}
