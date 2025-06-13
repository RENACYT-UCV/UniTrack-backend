import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BlockDTO, StarDTO, SubmitStarDTO, SubmitQRDTO, QROwnershipDTO } from './dto';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
    constructor(private blockchainServie: BlockchainService)  {}

    @Get("/height/:height")
    @HttpCode(HttpStatus.OK)
    blockByHeight(@Param("height") height: string) {
        const inputHeight: number = parseInt(height);
        return this.blockchainServie.getBlockByHeight(inputHeight);
    }

    @Post("/request")
    @HttpCode(HttpStatus.OK)
    async requestOwnership(@Body() body) {
        return await this.blockchainServie.requestMessageOwnershipVerification(body.address);
    }

    @Post("/star")
    @HttpCode(HttpStatus.OK)
    async SUBMITStar(@Body() star: SubmitStarDTO) {
        return await this.blockchainServie.submitStar(star.address, star.message, star.signature, star.star);
    }

    @Get("/hash/:hash")
    @HttpCode(HttpStatus.OK)
    blockByHash(@Param("hash") hash: string) {
        return this.blockchainServie.getBlockByHash(hash);
    }

    @Get("/:address")
    @HttpCode(HttpStatus.OK)
    starsByOwner(@Param("address") address: string) {
        return this.blockchainServie.getStarsByWalletAddress(address);
    }

    // QR-specific endpoints
    @Post("/qr/request")
    @HttpCode(HttpStatus.OK)
    async requestQROwnership(@Body() body: { userId: number }) {
        return await this.blockchainServie.requestQROwnershipVerification(body.userId);
    }

    @Post("/qr/submit")
    @HttpCode(HttpStatus.OK)
    async submitQR(@Body() qrData: SubmitQRDTO) {
        return await this.blockchainServie.submitQR(qrData);
    }

    @Get("/qr/user/:userId")
    @HttpCode(HttpStatus.OK)
    async getQRsByUserId(@Param("userId") userId: string) {
        return await this.blockchainServie.getQRsByUserId(parseInt(userId));
    }

    @Get("/qr/hash/:qrHash")
    @HttpCode(HttpStatus.OK)
    async getQRByHash(@Param("qrHash") qrHash: string) {
        return await this.blockchainServie.getQRByHash(qrHash);
    }

    @Get("/qr/all")
    @HttpCode(HttpStatus.OK)
    async getAllQRs() {
        return await this.blockchainServie.getAllQRs();
    }

}
