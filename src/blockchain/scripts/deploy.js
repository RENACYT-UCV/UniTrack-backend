// Script para desplegar el contrato QrRegistry en Polygon Amoy Testnet
const hre = require("hardhat");

async function main() {
  console.log("Iniciando despliegue del contrato QrRegistry...");

  // Obtener el contrato
  const QrRegistry = await hre.ethers.getContractFactory("QrRegistry");
  
  // Desplegar el contrato
  const qrRegistry = await QrRegistry.deploy();

  // Esperar a que se complete el despliegue
  await qrRegistry.waitForDeployment();

  // Obtener la dirección del contrato desplegado
  const contractAddress = await qrRegistry.getAddress();
  
  console.log(`Contrato QrRegistry desplegado en: ${contractAddress}`);
  console.log("Guarda esta dirección para configurar la integración en el backend.");

  // Guardar la información del contrato para referencia futura
  saveContractData(contractAddress);
}

// Función para guardar la información del contrato
function saveContractData(contractAddress) {
  const fs = require('fs');
  const path = require('path');
  
  // Crear el directorio si no existe
  const deploymentDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  // Guardar la dirección del contrato
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(deploymentDir, `${hre.network.name}-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`Información del despliegue guardada en: ${path.join(deploymentDir, `${hre.network.name}-deployment.json`)}`);
}

// Ejecutar la función principal
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error durante el despliegue:", error);
    process.exit(1);
  });