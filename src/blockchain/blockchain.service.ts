import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

// ABI del contrato QrRegistry (debe ser actualizado después del despliegue)
const QR_REGISTRY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_userId",
        "type": "uint256"
      }
    ],
    "name": "registerQr",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "verifyQr",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "getQrInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "userId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_userId",
        "type": "uint256"
      }
    ],
    "name": "getUserQrs",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "invalidateQr",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalQrs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "QrRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "QrInvalidated",
    "type": "event"
  }
];

export interface QrBlockchainInfo {
  userId: number;
  timestamp: number;
  isValid: boolean;
}

export interface BlockchainTransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private contractAddress: string;

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private initializeBlockchain() {
    try {
      // Configurar el proveedor RPC
      const rpcUrl = 'https://distinguished-wild-season.matic-amoy.quiknode.pro/e22aa051c19fff29def93466ab7c1b4a5de27241/';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Configurar la wallet (debe ser configurada en variables de entorno)
      const privateKey = this.configService.get<string>('BLOCKCHAIN_PRIVATE_KEY');
      if (!privateKey) {
        this.logger.warn('BLOCKCHAIN_PRIVATE_KEY no configurada. Las operaciones de escritura no estarán disponibles.');
        return;
      }

      this.wallet = new ethers.Wallet(privateKey, this.provider);

      // Configurar la dirección del contrato (debe ser configurada después del despliegue)
      this.contractAddress = this.configService.get<string>('QR_REGISTRY_CONTRACT_ADDRESS');
      if (!this.contractAddress) {
        this.logger.warn('QR_REGISTRY_CONTRACT_ADDRESS no configurada. El contrato no estará disponible.');
        return;
      }

      // Inicializar el contrato
      this.contract = new ethers.Contract(this.contractAddress, QR_REGISTRY_ABI, this.wallet);
      
      this.logger.log('Blockchain service inicializado correctamente');
    } catch (error) {
      this.logger.error('Error inicializando blockchain service:', error);
    }
  }

  /**
   * Registra un QR en la blockchain
   */
  async registerQr(hash: string, userId: number): Promise<BlockchainTransactionResult> {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      this.logger.log(`Registrando QR en blockchain: hash=${hash}, userId=${userId}`);
      
      const tx = await this.contract.registerQr(hash, userId);
      const receipt = await tx.wait();
      
      this.logger.log(`QR registrado exitosamente. TX: ${receipt.hash}`);
      
      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error) {
      this.logger.error('Error registrando QR en blockchain:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verifica si un QR es válido en la blockchain
   */
  async verifyQr(hash: string): Promise<boolean> {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const isValid = await this.contract.verifyQr(hash);
      return isValid;
    } catch (error) {
      this.logger.error('Error verificando QR en blockchain:', error);
      return false;
    }
  }

  /**
   * Obtiene la información de un QR desde la blockchain
   */
  async getQrInfo(hash: string): Promise<QrBlockchainInfo | null> {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const [userId, timestamp, isValid] = await this.contract.getQrInfo(hash);
      
      return {
        userId: Number(userId),
        timestamp: Number(timestamp),
        isValid,
      };
    } catch (error) {
      this.logger.error('Error obteniendo información del QR:', error);
      return null;
    }
  }

  /**
   * Obtiene todos los QRs de un usuario desde la blockchain
   */
  async getUserQrs(userId: number): Promise<string[]> {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const qrHashes = await this.contract.getUserQrs(userId);
      return qrHashes;
    } catch (error) {
      this.logger.error('Error obteniendo QRs del usuario:', error);
      return [];
    }
  }

  /**
   * Invalida un QR en la blockchain
   */
  async invalidateQr(hash: string): Promise<BlockchainTransactionResult> {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      this.logger.log(`Invalidando QR en blockchain: hash=${hash}`);
      
      const tx = await this.contract.invalidateQr(hash);
      const receipt = await tx.wait();
      
      this.logger.log(`QR invalidado exitosamente. TX: ${receipt.hash}`);
      
      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error) {
      this.logger.error('Error invalidando QR en blockchain:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene el número total de QRs registrados
   */
  async getTotalQrs(): Promise<number> {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const total = await this.contract.getTotalQrs();
      return Number(total);
    } catch (error) {
      this.logger.error('Error obteniendo total de QRs:', error);
      return 0;
    }
  }

  /**
   * Verifica si el servicio está correctamente configurado
   */
  isConfigured(): boolean {
    return !!(this.provider && this.wallet && this.contract);
  }

  /**
   * Obtiene el balance de la wallet en MATIC
   */
  async getWalletBalance(): Promise<string> {
    try {
      if (!this.wallet) {
        return '0';
      }

      const balance = await this.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      this.logger.error('Error obteniendo balance de la wallet:', error);
      return '0';
    }
  }
}