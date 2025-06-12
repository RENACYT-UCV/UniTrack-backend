// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QrRegistry
 * @dev Contrato para registrar códigos QR asociados a usuarios en la blockchain
 * Basado en las entidades QR y User del sistema UniTrack
 */
contract QrRegistry {
    // Estructura para almacenar la información del QR
    struct QrInfo {
        uint256 userId;      // idUsuario
        string hash;         // hash del QR
        uint256 timestamp;   // timestamp de creación
        bool isValid;        // indica si el QR es válido
    }
    
    // Mapeo de hash del QR a su información
    mapping(string => QrInfo) private qrRecords;
    
    // Mapeo de usuario a sus QRs (array de hashes)
    mapping(uint256 => string[]) private userQrs;
    
    // Array de todos los hashes de QR registrados
    string[] private allQrHashes;
    
    // Eventos
    event QrRegistered(string hash, uint256 userId, uint256 timestamp);
    event QrInvalidated(string hash, uint256 timestamp);
    
    /**
     * @dev Registra un nuevo QR en la blockchain
     * @param _hash Hash del código QR
     * @param _userId ID del usuario que crea el QR
     */
    function registerQr(string memory _hash, uint256 _userId) public {
        // Verificar que el hash no esté ya registrado o esté invalidado
        require(!qrRecords[_hash].isValid, "QR ya registrado y valido");
        
        // Crear nuevo registro de QR
        QrInfo memory newQr = QrInfo({
            userId: _userId,
            hash: _hash,
            timestamp: block.timestamp,
            isValid: true
        });
        
        // Guardar el registro
        qrRecords[_hash] = newQr;
        
        // Añadir el hash a la lista de QRs del usuario
        userQrs[_userId].push(_hash);
        
        // Añadir el hash a la lista global
        allQrHashes.push(_hash);
        
        // Emitir evento
        emit QrRegistered(_hash, _userId, block.timestamp);
    }
    
    /**
     * @dev Invalida un QR existente
     * @param _hash Hash del código QR a invalidar
     */
    function invalidateQr(string memory _hash) public {
        // Verificar que el QR exista y sea válido
        require(qrRecords[_hash].isValid, "QR no encontrado o ya invalidado");
        
        // Invalidar el QR
        qrRecords[_hash].isValid = false;
        
        // Emitir evento
        emit QrInvalidated(_hash, block.timestamp);
    }
    
    /**
     * @dev Verifica si un QR es válido
     * @param _hash Hash del código QR a verificar
     * @return bool indicando si el QR es válido
     */
    function verifyQr(string memory _hash) public view returns (bool) {
        return qrRecords[_hash].isValid;
    }
    
    /**
     * @dev Obtiene la información de un QR
     * @param _hash Hash del código QR
     * @return userId ID del usuario creador
     * @return timestamp Timestamp de creación
     * @return isValid Indica si el QR es válido
     */
    function getQrInfo(string memory _hash) public view returns (
        uint256 userId,
        uint256 timestamp,
        bool isValid
    ) {
        QrInfo memory qrInfo = qrRecords[_hash];
        return (qrInfo.userId, qrInfo.timestamp, qrInfo.isValid);
    }
    
    /**
     * @dev Obtiene todos los QRs de un usuario
     * @param _userId ID del usuario
     * @return array de hashes de QR
     */
    function getUserQrs(uint256 _userId) public view returns (string[] memory) {
        return userQrs[_userId];
    }
    
    /**
     * @dev Obtiene el número total de QRs registrados
     * @return uint256 número total de QRs
     */
    function getTotalQrs() public view returns (uint256) {
        return allQrHashes.length;
    }
}