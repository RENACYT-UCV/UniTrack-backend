const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QrRegistry", function () {
  let qrRegistry;
  let owner;
  let addr1;
  let addr2;

  // Configuración antes de cada prueba
  beforeEach(async function () {
    // Obtener las cuentas de prueba
    [owner, addr1, addr2] = await ethers.getSigners();

    // Desplegar el contrato
    const QrRegistry = await ethers.getContractFactory("QrRegistry");
    qrRegistry = await QrRegistry.deploy();
  });

  describe("Registro de QR", function () {
    it("Debería registrar un nuevo QR correctamente", async function () {
      const userId = 1;
      const qrHash = "0x123456789abcdef";

      // Registrar el QR
      await qrRegistry.registerQr(qrHash, userId);

      // Verificar que el QR esté registrado y sea válido
      expect(await qrRegistry.verifyQr(qrHash)).to.equal(true);

      // Verificar la información del QR
      const qrInfo = await qrRegistry.getQrInfo(qrHash);
      expect(qrInfo[0]).to.equal(userId); // userId
      expect(qrInfo[2]).to.equal(true);   // isValid
    });

    it("No debería permitir registrar el mismo QR dos veces", async function () {
      const userId = 1;
      const qrHash = "0x123456789abcdef";

      // Registrar el QR por primera vez
      await qrRegistry.registerQr(qrHash, userId);

      // Intentar registrar el mismo QR de nuevo debería fallar
      await expect(
        qrRegistry.registerQr(qrHash, userId)
      ).to.be.revertedWith("QR ya registrado y valido");
    });
  });

  describe("Invalidación de QR", function () {
    it("Debería invalidar un QR correctamente", async function () {
      const userId = 1;
      const qrHash = "0x123456789abcdef";

      // Registrar el QR
      await qrRegistry.registerQr(qrHash, userId);

      // Invalidar el QR
      await qrRegistry.invalidateQr(qrHash);

      // Verificar que el QR ya no sea válido
      expect(await qrRegistry.verifyQr(qrHash)).to.equal(false);

      // Verificar la información del QR
      const qrInfo = await qrRegistry.getQrInfo(qrHash);
      expect(qrInfo[2]).to.equal(false); // isValid
    });

    it("No debería permitir invalidar un QR inexistente", async function () {
      const qrHash = "0xnonexistentqr";

      // Intentar invalidar un QR inexistente debería fallar
      await expect(
        qrRegistry.invalidateQr(qrHash)
      ).to.be.revertedWith("QR no encontrado o ya invalidado");
    });
  });

  describe("Consulta de QRs por usuario", function () {
    it("Debería devolver todos los QRs de un usuario", async function () {
      const userId = 1;
      const qrHash1 = "0x123456789abcdef1";
      const qrHash2 = "0x123456789abcdef2";

      // Registrar dos QRs para el mismo usuario
      await qrRegistry.registerQr(qrHash1, userId);
      await qrRegistry.registerQr(qrHash2, userId);

      // Obtener los QRs del usuario
      const userQrs = await qrRegistry.getUserQrs(userId);

      // Verificar que se devuelvan ambos QRs
      expect(userQrs.length).to.equal(2);
      expect(userQrs).to.include(qrHash1);
      expect(userQrs).to.include(qrHash2);
    });

    it("Debería devolver un array vacío para un usuario sin QRs", async function () {
      const userId = 999; // Usuario que no ha registrado QRs

      // Obtener los QRs del usuario
      const userQrs = await qrRegistry.getUserQrs(userId);

      // Verificar que se devuelva un array vacío
      expect(userQrs.length).to.equal(0);
    });
  });

  describe("Contador de QRs", function () {
    it("Debería contar correctamente el número total de QRs", async function () {
      // Inicialmente no hay QRs
      expect(await qrRegistry.getTotalQrs()).to.equal(0);

      // Registrar tres QRs
      await qrRegistry.registerQr("0xqr1", 1);
      await qrRegistry.registerQr("0xqr2", 1);
      await qrRegistry.registerQr("0xqr3", 2);

      // Verificar que el contador sea 3
      expect(await qrRegistry.getTotalQrs()).to.equal(3);
    });
  });
});