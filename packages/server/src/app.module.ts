import { Module } from '@nestjs/common';
import { DappModule } from './modules/dapp/dapp.module';
import { AdminModule } from './modules/admin/admin.module';

// CustomizerModule is required only during development. This line may
// be safely deleted once dapp development is completed. It is also
// ok to leave it in place as it only functions on localhost
import { CustomizerModule } from './customizer.module';

@Module({
  imports: [
    DappModule,
    AdminModule,
    CustomizerModule   // Only required during development
  ]
})
export class AppModule {}
