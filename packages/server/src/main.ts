import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    preflightContinue: false
  });
  const options = new DocumentBuilder()
    .setTitle('DappStarter')
    .setDescription('Full-Stack Blockchain App Mojo')
    .setVersion('1.0')
    .addTag('trycrypto')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document, {
    customCss: `
    .topbar {display: none}
    `
  });

  await app.listen(process.env.PORT || 5002);
}
bootstrap();
