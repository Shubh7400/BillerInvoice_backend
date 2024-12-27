import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { json, urlencoded } from 'express'; // Use these directly from Express
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(
    cors({
      origin: '*', // You can specify the origin or origins that are allowed to access your API
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // HTTP methods allowed
      credentials: true, // Enable credentials (e.g., cookies) for cross-origin requests
    }),
  );
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  await app.listen(4000 , ()=>{
    console.log('server will listen on port 4000');
  });
}
bootstrap();
