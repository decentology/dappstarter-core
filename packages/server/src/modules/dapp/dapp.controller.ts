import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DappService } from './dapp.service';
///+api-controller-import

@ApiTags('Dapp')
@Controller('api')
export class DappController {

  constructor(private readonly dappService: DappService) { }

///+api-controller

 @Get('sample')
 @ApiOperation({ summary: 'Sample API end-point' })
 async sample(@Query('greeting') greeting: string): Promise<string> {
   return await this.dappService.sample(greeting);
 }
  
}
