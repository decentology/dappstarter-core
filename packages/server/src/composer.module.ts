// This file is required only during development and may be deleted
// when your dapp is deployed. Since it works only on localhost, it
// is also safe to leave it in place.

import { Module } from '@nestjs/common';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Observable } from 'rxjs';

export class ComposerGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return !process.env.NODE_ENV || (process.env.NODE_ENV === 'development');
  }
}

@Injectable()
class ComposerService {

  async info(): Promise<any> {
    return `Hello Composer Info!`;
  }

  async process(): Promise<any> {
    return `Hello Composer Process!`;    
  }

}
@Controller('api/composer')
class ComposerController {

  constructor(private readonly composerService: ComposerService) { }

  @UseGuards(ComposerGuard)
  @ApiExcludeEndpoint()
  @Get('info')
  async info(): Promise<any> {
    return await this.composerService.info();
  }

  @UseGuards(ComposerGuard)
  @ApiExcludeEndpoint()
  @Post('process')
  async process(): Promise<any> {
    return await this.composerService.process();
  }
  
}


@Module({
  controllers: [ComposerController],
  providers: [ComposerService],
})
export class ComposerModule {}
