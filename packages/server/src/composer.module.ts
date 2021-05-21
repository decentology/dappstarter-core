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

  async info(moduleName: string): Promise<any> {
    let root = path.join(__dirname,'..','..','..');
    let configFile = path.join(root, 'workspace', 'composer', moduleName, 'composer.json');

    if (fse.existsSync(configFile)) {
      let config = JSON.parse(fse.readFileSync(configFile, 'utf8'));
      for(let feature in config) {
        config[feature].options.forEach((option) => {

          let previewPath = path.join(root, 'workspace', 'composer', moduleName, `${feature}-${option.name}`, 'preview.png');
          if (fse.existsSync(previewPath)) {
            var previewImage = fse.readFileSync(previewPath);
            option.preview = Buffer.from(previewImage).toString('base64');  
          }
        });

      }
      return config; 
    } else {
      return {}
    }
  }

  async process(moduleName: string, feature: string, option: string): Promise<any> {

    let root = path.join(__dirname,'..','..','..');
    let clientRoot = path.join(root, 'packages', 'client', 'src', 'components', moduleName, feature);
    let composerRoot = path.join(root, 'workspace', 'composer');
    let dapplibRoot = path.join(root, 'packages', 'dapplib', 'contracts', 'imports', moduleName, feature);

    // Import path exception for Cadence
    if (fse.existsSync(path.join(root, 'packages', 'dapplib', 'contracts', 'project'))) {
      dapplibRoot = path.join(root, 'packages', 'dapplib', 'contracts', 'project', 'imports');
    }

    // Ensures complete redeployment of contracts and removal of artifacts
    let buildRoot =  path.join(root, 'packages', 'dapplib', 'build');
    if (fse.existsSync(buildRoot)) {
      fse.removeSync(buildRoot);
    }

    // Delete packages/client/src/components/{moduleName}/{feature}
    fse.removeSync(clientRoot);

    // Delete packages/dapplib/contracts/imports/{moduleName}/{feature}
    fse.removeSync(dapplibRoot);

    // Copy from workspace/composer/{category}/{feature}-{option}
    fse.copySync(path.join(composerRoot, moduleName, feature + '-' + option), path.join(root, 'packages'));
  
    return true;    
  }
  
}
@Controller('api/composer')
class ComposerController {

  constructor(private readonly composerService: ComposerService) { }

  @UseGuards(ComposerGuard)
  //@ApiExcludeEndpoint()
  @Get('info/:moduleName')
  async info(@Param('moduleName') moduleName: string): Promise<any> {
    return await this.composerService.info(moduleName);
  }

  @UseGuards(ComposerGuard)
  //@ApiExcludeEndpoint()
  @Post('process/:moduleName/:feature/:option')
  async process(@Param('moduleName') moduleName: string, @Param('feature') feature: string, @Param('option') option: string): Promise<any> {
    return await this.composerService.process(moduleName, feature, option);
  }
  
}


@Module({
  controllers: [ComposerController],
  providers: [ComposerService],
})
export class ComposerModule {}
