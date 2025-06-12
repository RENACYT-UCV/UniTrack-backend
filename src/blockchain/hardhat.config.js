require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '../../.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: "https://distinguished-wild-season.matic-amoy.quiknode.pro/e22aa051c19fff29def93466ab7c1b4a5de27241/",
      // La clave privada debe ser configurada en el archivo .env
      // accounts: [process.env.PRIVATE_KEY],
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
      },
    },
    hardhat: {
      // Configuración para la red local de Hardhat
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};