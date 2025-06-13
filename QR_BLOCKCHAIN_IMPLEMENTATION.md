# QR Blockchain Implementation - UniTrack Backend

## Descripción

Esta implementación integra el sistema de códigos QR con blockchain, permitiendo almacenar identificadores de QR de manera inmutable y segura en una blockchain privada.

## Características Principales

- **Almacenamiento en Blockchain**: Los QRs se guardan en bloques inmutables
- **Verificación Segura**: Verificación de QRs directamente desde la blockchain
- **Trazabilidad**: Historial completo de QRs por usuario
- **API RESTful**: Endpoints completos para gestión de QRs
- **Documentación Swagger**: API completamente documentada

## Nuevas Dependencias Instaladas

```json
{
  "bitcoinjs-lib": "^6.1.5",
  "bitcoinjs-message": "^2.2.0",
  "body-parser": "^1.20.2",
  "crypto-js": "^4.2.0",
  "express": "^4.18.2",
  "hex2ascii": "^0.0.3",
  "morgan": "^1.10.0"
}
```

## Estructura de Archivos Modificados/Creados

### Archivos Modificados

1. **`src/blockchain/dto/blockchain.dto.ts`**
   - Agregadas nuevas DTOs: `QROwnershipDTO`, `SubmitQRDTO`

2. **`src/blockchain/blockchain.service.ts`**
   - Nuevos métodos para manejo de QRs en blockchain
   - `requestQROwnershipVerification()`
   - `submitQR()`
   - `getQRsByUserId()`
   - `getQRByHash()`
   - `getAllQRs()`

3. **`src/blockchain/blockchain.controller.ts`**
   - Nuevos endpoints para QRs:
     - `POST /blockchain/qr/request`
     - `POST /blockchain/qr/submit`
     - `GET /blockchain/qr/user/:userId`
     - `GET /blockchain/qr/hash/:qrHash`
     - `GET /blockchain/qr/all`

4. **`src/blockchain/blockchain.module.ts`**
   - Exporta `BlockchainService` para uso en otros módulos

5. **`src/qr/qr.service.ts`**
   - Integración con `BlockchainService`
   - Nuevos métodos:
     - `createQRWithBlockchain()`
     - `getQRFromBlockchain()`
     - `getUserQRsFromBlockchain()`
     - `getAllQRsFromBlockchain()`
     - `verificarQREnBlockchain()`

6. **`src/qr/qr.controller.ts`**
   - Nuevos endpoints con documentación Swagger:
     - `POST /qr/crear-blockchain`
     - `GET /qr/blockchain/:qrHash`
     - `GET /qr/blockchain/usuario/:userId`
     - `GET /qr/blockchain/todos`
     - `POST /qr/verificar-blockchain`

7. **`src/qr/qr.module.ts`**
   - Importa `BlockchainModule`

### Archivos Creados

1. **`src/qr/dto/create-qr-blockchain.dto.ts`**
   - DTOs específicos para operaciones de QR en blockchain
   - `CreateQRBlockchainDto`
   - `QRBlockchainResponseDto`
   - `QRVerificationResponseDto`

## API Endpoints

### Endpoints de QR con Blockchain

#### 1. Crear QR en Blockchain
```http
POST /qr/crear-blockchain
Content-Type: application/json

{
  "userId": 1,
  "qrData": {
    "description": "QR para acceso al laboratorio",
    "location": "Lab 101"
  }
}
```

**Respuesta:**
```json
{
  "qrHash": "abc123...",
  "blockHash": "def456...",
  "message": "QR creado y guardado en blockchain exitosamente"
}
```

#### 2. Obtener QR por Hash
```http
GET /qr/blockchain/{qrHash}
```

#### 3. Obtener QRs de Usuario
```http
GET /qr/blockchain/usuario/{userId}
```

#### 4. Obtener Todos los QRs
```http
GET /qr/blockchain/todos
```

#### 5. Verificar QR en Blockchain
```http
POST /qr/verificar-blockchain
Content-Type: application/json

{
  "hash": "abc123..."
}
```

**Respuesta:**
```json
{
  "found": true,
  "data": {
    "userId": 1,
    "qrHash": "abc123...",
    "timestamp": "1640995200",
    "metadata": {
      "description": "QR para acceso al laboratorio",
      "location": "Lab 101"
    }
  },
  "message": "QR encontrado en blockchain"
}
```

### Endpoints de Blockchain Directos

#### 1. Solicitar Verificación de Propiedad
```http
POST /blockchain/qr/request
Content-Type: application/json

{
  "userId": 1
}
```

#### 2. Enviar QR a Blockchain
```http
POST /blockchain/qr/submit
Content-Type: application/json

{
  "userId": 1,
  "qrHash": "abc123...",
  "message": "1:1640995200:qrRegistry",
  "signature": "signature_1_1640995200",
  "qrData": {
    "description": "QR para acceso al laboratorio"
  }
}
```

## Flujo de Trabajo

### 1. Creación de QR
1. Usuario solicita crear un QR
2. Sistema genera hash único
3. Se solicita mensaje de verificación
4. Se crea bloque en blockchain
5. Se genera imagen QR
6. Se guarda en base de datos local
7. Se retorna información del QR y bloque

### 2. Verificación de QR
1. Usuario escanea QR
2. Sistema busca en blockchain por hash
3. Retorna información si existe
4. Valida integridad del bloque

### 3. Consulta de QRs
1. Por usuario: Filtra bloques por userId
2. Por hash: Busca bloque específico
3. Todos: Retorna todos los QRs en blockchain

## Estructura de Datos en Blockchain

### QROwnershipDTO
```typescript
{
  userId: number;        // ID del usuario propietario
  qrHash: string;        // Hash único del QR
  timestamp: string;     // Timestamp de creación
  metadata?: any;        // Datos adicionales del QR
}
```

### BlockDTO
```typescript
{
  hash: string;              // Hash del bloque
  height: number;            // Altura del bloque
  body: string;              // Datos codificados en hex
  time: string;              // Timestamp del bloque
  previousBlockHash: string; // Hash del bloque anterior
}
```

## Seguridad

- **Inmutabilidad**: Los datos en blockchain no pueden ser modificados
- **Validación**: Cada bloque es validado antes de ser agregado
- **Trazabilidad**: Historial completo de todas las operaciones
- **Verificación**: Mensajes con timestamp para evitar replay attacks

## Consideraciones de Implementación

1. **Firma Digital**: Actualmente usa firma simplificada, se recomienda implementar firma digital real para producción
2. **Escalabilidad**: Para grandes volúmenes, considerar optimizaciones de búsqueda
3. **Persistencia**: La blockchain actual es en memoria, considerar persistencia en disco
4. **Red**: Implementación actual es single-node, considerar red distribuida

## Testing

Para probar la implementación:

1. Iniciar el servidor: `npm run start:dev`
2. Acceder a Swagger: `http://localhost:3000/api`
3. Probar endpoints de QR blockchain
4. Verificar que los QRs se almacenan correctamente

## Próximos Pasos

1. Implementar firma digital real
2. Agregar persistencia de blockchain
3. Implementar red distribuida
4. Agregar métricas y monitoreo
5. Optimizar consultas para mejor rendimiento