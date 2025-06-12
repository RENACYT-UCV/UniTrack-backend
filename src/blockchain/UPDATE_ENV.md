# Actualización del archivo .env para integración con blockchain

Para habilitar la integración con blockchain, es necesario actualizar el archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# Variables para blockchain

# Dirección del contrato QrRegistry desplegado en Polygon Amoy Testnet
QR_REGISTRY_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Clave privada para firmar transacciones (NUNCA compartir o subir a repositorios)
BLOCKCHAIN_PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# URL del proveedor RPC de Polygon Amoy Testnet
BLOCKCHAIN_RPC_URL=https://distinguished-wild-season.matic-amoy.quiknode.pro/e22aa051c19fff29def93466ab7c1b4a5de27241/
```

## Instrucciones

1. Abrir el archivo `.env` en la raíz del proyecto
2. Añadir las variables anteriores al final del archivo
3. Reemplazar los valores de ejemplo con los valores reales:
   - `QR_REGISTRY_CONTRACT_ADDRESS`: Dirección del contrato QrRegistry desplegado en Polygon Amoy Testnet
   - `BLOCKCHAIN_PRIVATE_KEY`: Clave privada de la cuenta que firmará las transacciones

## Obtención de los valores

### Dirección del contrato

La dirección del contrato se obtiene después de desplegar el contrato QrRegistry en Polygon Amoy Testnet. Para desplegar el contrato, sigue las instrucciones en el archivo `README.md` de la carpeta `blockchain`.

Una vez desplegado, la dirección del contrato se guardará en el archivo `deployments/polygonAmoy-deployment.json`.

### Clave privada

La clave privada debe ser de una cuenta con fondos en Polygon Amoy Testnet. Puedes obtener fondos de prueba en los faucets mencionados en el archivo `README.md`.

**IMPORTANTE**: Nunca compartas tu clave privada ni la subas a repositorios públicos o privados. La clave privada da acceso completo a los fondos de la cuenta.

## Verificación

Para verificar que la configuración es correcta, puedes ejecutar el siguiente comando después de iniciar la aplicación:

```bash
curl http://localhost:3000/api/blockchain/status
```

Esto devolverá el estado de la conexión con la blockchain y el balance de la cuenta configurada.