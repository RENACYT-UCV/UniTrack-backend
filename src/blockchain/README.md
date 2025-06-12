# UniTrack Blockchain Integration

Este directorio contiene la integración de blockchain para el proyecto UniTrack, permitiendo registrar códigos QR en la blockchain de Polygon Amoy Testnet.

## Estructura del Proyecto

```
/blockchain
  /contracts        # Contratos inteligentes en Solidity
  /scripts          # Scripts para despliegue y tareas
  /test             # Pruebas para los contratos
  /deployments      # Información de despliegues (generado automáticamente)
  hardhat.config.js # Configuración de Hardhat
  package.json      # Dependencias para la parte blockchain
```

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Una cuenta de Ethereum con MATIC de prueba para Polygon Amoy Testnet

## Configuración

1. Instalar las dependencias:

```bash
cd src/blockchain
npm install
```

2. Configurar las variables de entorno:

Crea o modifica el archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# Variables para blockchain
PRIVATE_KEY=tu_clave_privada_aqui
# O alternativamente
MNEMONIC=tu_frase_semilla_aqui
```

**IMPORTANTE**: Nunca compartas o subas a repositorios tu clave privada o mnemónico.

## Compilación del Contrato

Para compilar el contrato inteligente:

```bash
npm run compile
```

Esto generará los artefactos del contrato en el directorio `artifacts/`.

## Pruebas

Para ejecutar las pruebas del contrato:

```bash
npm run test
```

## Despliegue

### En Polygon Amoy Testnet

Para desplegar el contrato en Polygon Amoy Testnet:

```bash
npm run deploy:amoy
```

Este comando ejecutará el script `scripts/deploy.js` en la red Polygon Amoy Testnet configurada en `hardhat.config.js`.

### En Red Local (para desarrollo)

Para desplegar en una red local de Hardhat (útil para desarrollo):

```bash
npm run deploy:local
```

## Después del Despliegue

Una vez desplegado el contrato, se generará un archivo JSON en el directorio `deployments/` con la información del despliegue, incluyendo la dirección del contrato.

Esta dirección debe ser configurada en el servicio de blockchain de NestJS para interactuar con el contrato.

## Integración con NestJS

Para integrar el contrato con el backend de NestJS, se debe:

1. Copiar el ABI del contrato desde `artifacts/contracts/QrRegistry.sol/QrRegistry.json`
2. Configurar la dirección del contrato desplegado en el servicio de blockchain
3. Utilizar ethers.js o web3.js para interactuar con el contrato desde el backend

## Obtener MATIC de Prueba

Para obtener MATIC de prueba para Polygon Amoy Testnet, puedes usar los siguientes faucets:

- [Polygon Faucet](https://faucet.polygon.technology/)
- [QuickNode Faucet](https://faucet.quicknode.com/polygon/amoy)