import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Block } from './entities/block.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { AddBlockDto } from './dto/blockchain.dto';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the entire blockchain' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the blockchain.',
    type: [Block],
  })
  getChain() {
    return this.blockchainService.getChain();
  }

  @Post('add')
  @ApiOperation({ summary: 'Add a new block to the blockchain' })
  @ApiBody({ type: AddBlockDto })
  @ApiResponse({
    status: 201,
    description: 'The block has been successfully added.',
    type: Block,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async addBlock(@Body() addBlockDto: AddBlockDto) {
    return this.blockchainService.addBlock(
      addBlockDto.data,
      addBlockDto.idUsuario,
    );
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate the integrity of the blockchain' })
  @ApiResponse({
    status: 200,
    description: 'Blockchain validation result.',
    type: Boolean,
  })
  validate() {
    return { valid: this.blockchainService.isValid() };
  }

  @Get('exists')
  @ApiOperation({
    summary: 'Check if a block with a given hash exists in the blockchain',
  })
  @ApiQuery({
    name: 'hash',
    description: 'The hash of the block to check',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Block existence result.',
    type: Boolean,
  })
  exists(@Query('hash') hash: string) {
    const exists = this.blockchainService
      .getChain()
      .some((block) => block.hash === hash);
    return { exists };
  }
}
