# Instrucciones de Configuración para la Integración con Blockchain

Este documento proporciona instrucciones paso a paso para configurar y utilizar la integración con blockchain en el proyecto UniTrack.

## Índice

1. [Instalación de Dependencias](#1-instalación-de-dependencias)
2. [Configuración del Entorno](#2-configuración-del-entorno)
3. [Compilación y Despliegue del Contrato](#3-compilación-y-despliegue-del-contrato)
4. [Configuración del Backend](#4-configuración-del-backend)
5. [Pruebas de la Integración](#5-pruebas-de-la-integración)
6. [Integración con el Servicio de QR](#6-integración-con-el-servicio-de-qr)

## 1. Instalación de Dependencias

### 1.1. Dependencias del Proyecto Principal

En la raíz del proyecto, ejecutar:

```bash
npm install ethers@6.8.0
```

### 1.2. Dependencias para el Desarrollo de Contratos

En la carpeta `src/blockchain`, ejecutar:

```bash
cd src/blockchain
npm install
```

## 2. Configuración del Entorno

### 2.1. Crear una Cuenta de Ethereum

Si aún no tienes una cuenta de Ethereum:

1. Instala [MetaMask](https://metamask.io/) como extensión de navegador
2. Crea una nueva cuenta siguiendo las instrucciones
3. Guarda de forma segura tu clave privada y frase mnemónica

### 2.2. Obtener MATIC de Prueba

Para obtener MATIC de prueba para Polygon Amoy Testnet:

1. Visita [QuickNode Faucet](https://faucet.quicknode.com/polygon/amoy)
2. Ingresa tu dirección de Ethereum
3. Solicita los tokens de prueba

### 2.3. Configurar Variables de Entorno

Actualiza el archivo `.env` en la raíz del proyecto con las variables necesarias para blockchain:

```
# Variables para blockchain

# Dirección del contrato QrRegistry desplegado en Polygon Amoy Testnet
# (Se obtendrá después del despliegue)
QR_REGISTRY_CONTRACT_ADDRESS=

# Clave privada para firmar transacciones (NUNCA compartir o subir a repositorios)
BLOCKCHAIN_PRIVATE_KEY=tu_clave_privada_aqui

# URL del proveedor RPC de Polygon Amoy Testnet
BLOCKCHAIN_RPC_URL=https://distinguished-wild-season.matic-amoy.quiknode.pro/e22aa051c19fff29def93466ab7c1b4a5de27241/
```

## 3. Compilación y Despliegue del Contrato

### 3.1. Compilar el Contrato

En la carpeta `src/blockchain`, ejecutar:

```bash
npm run compile
```

### 3.2. Ejecutar Pruebas

Para verificar que el contrato funciona correctamente:

```bash
npm run test
```

### 3.3. Desplegar el Contrato en Polygon Amoy Testnet

```bash
npm run deploy:amoy
```

Este comando desplegará el contrato y guardará la información del despliegue en `deployments/polygonAmoy-deployment.json`.

### 3.4. Actualizar la Variable de Entorno

Copia la dirección del contrato desplegado desde el archivo de despliegue y actualiza la variable `QR_REGISTRY_CONTRACT_ADDRESS` en el archivo `.env`.

## 4. Configuración del Backend

### 4.1. Reiniciar el Servidor

Reinicia el servidor NestJS para que cargue las nuevas variables de entorno:

```bash
npm run start:dev
```

### 4.2. Verificar la Configuración

Verifica que la integración con blockchain esté correctamente configurada accediendo a:

```
GET http://localhost:3000/blockchain/status
```

Deberías recibir una respuesta similar a:

```json
{
  "isConfigured": true,
  "balance": "0.5",
  "totalQrs": 0,
  "provider": "Polygon Amoy Testnet"
}
```

## 5. Pruebas de la Integración

### 5.1. Registrar un QR

Para registrar un QR en la blockchain:

```
POST http://localhost:3000/blockchain/register-qr

Body:
{
  "hash": "qr123456789",
  "userId": 1
}
```

### 5.2. Verificar un QR

Para verificar un QR en la blockchain:

```
GET http://localhost:3000/blockchain/verify-qr/qr123456789
```

### 5.3. Obtener QRs de un Usuario

Para obtener todos los QRs de un usuario:

```
GET http://localhost:3000/blockchain/user-qrs/1
```

## 6. Integración con el Servicio de QR

Para integrar la funcionalidad de blockchain con el servicio de QR existente, puedes seguir el ejemplo proporcionado en `src/blockchain/examples/qr-service-integration.example.ts`.

Pasos principales:

1. Inyectar el `BlockchainService` en el servicio de QR
2. Modificar los métodos relevantes para registrar los QRs en la blockchain
3. Añadir métodos para verificar los QRs tanto en la base de datos local como en la blockchain

Ejemplo de modificación del servicio de QR:

```typescript
// En qr.service.ts

import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class QrService {
  constructor(
    // ... dependencias existentes
    private blockchainService: BlockchainService,
  ) {}

  async createQr(userId: number, hash: string) {
    // Lógica existente para crear QR en la base de datos local
    
    // Registrar en blockchain
    await this.blockchainService.registerQr(hash, userId);
    
    // Resto de la lógica
  }
}
```

## Notas Importantes

- **Seguridad**: Nunca compartas o subas a repositorios tu clave privada o mnemónico.
- **Costos**: En la red principal de Ethereum o Polygon, cada transacción tiene un costo en gas. En las redes de prueba como Amoy, el gas se paga con tokens de prueba que no tienen valor real.
- **Latencia**: Las transacciones en blockchain pueden tardar varios segundos o minutos en confirmarse, dependiendo de la congestión de la red.
- **Persistencia**: Los datos almacenados en la blockchain son inmutables y permanentes. Asegúrate de validar los datos antes de enviarlos.