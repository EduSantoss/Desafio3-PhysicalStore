import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
   
  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API para localização e cálculo de fretes de lojas')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Servidor rodando na porta 3000...`);
}
bootstrap();
