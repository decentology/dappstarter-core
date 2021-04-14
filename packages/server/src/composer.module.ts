// This file is required only during development and may be deleted
// when your dapp is deployed. Since it works only on localhost, it
// is also safe to leave it in place.

import { Module } from '@nestjs/common';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import * as fse from 'fs-extra';
import * as path from 'path';

export class ComposerGuard implements CanActivate{
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return !process.env.NODE_ENV || (process.env.NODE_ENV === 'development');
  }
}

@Injectable()
class ComposerService {

  async info(): Promise<any> {
    return `Hello world`;  
  }

  async process(feature: string, option: string, value: string): Promise<any> {

    let root = path.join(__dirname,'..','..','..');
    let clientRoot = path.join(root, 'packages', 'client', 'src', 'components', feature, option);
    let dapplibRoot = path.join(root, 'packages', 'dapplib', 'contracts', 'imports', feature, option);
    let composerRoot = path.join(root, 'workspace', 'composer');

      // Delete packages/client/src/components/{feature}/{option}
      fse.removeSync(clientRoot);

      // Delete packages/dapplib/contracts/imports/{feature}/{option}
      fse.removeSync(dapplibRoot);

      // Copy from workspace/composer/{category}/{feature}-{option}
      fse.copySync(path.join(composerRoot, feature, option + '-' + value), path.join(root, 'packages'));
    
    return `SUCCESS! 😃`;    
  }

}
@Controller('api/composer')
class ComposerController {

  constructor(private readonly composerService: ComposerService) { }

  @UseGuards(ComposerGuard)
  //@ApiExcludeEndpoint()
  @Get('info')
  async info(): Promise<any> {
    return await this.composerService.info();
  }

  @UseGuards(ComposerGuard)
  //@ApiExcludeEndpoint()
  @Post('process/:feature/:option/:value')
  async process(@Param('feature') feature: string, @Param('option') option: string, @Param('value') value: string): Promise<any> {
    return await this.composerService.process(feature, option, value);
  }
  
}


@Module({
  controllers: [ComposerController],
  providers: [ComposerService],
})
export class ComposerModule {}
