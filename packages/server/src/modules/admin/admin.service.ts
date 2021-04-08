import { Injectable } from '@nestjs/common';
import * as DappLib from '@decentology/dappstarter-dapplib';
///+api-admin-service-import

@Injectable()
export class AdminService {

  async sample(greeting: string): Promise<any> {
    return `API admin ${greeting}!`;
  }

///+api-admin-service

}
