import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Ensure .env variables are loaded

async function bootstrap() {
  console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET); // Debugging log

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Enable CORS to allow frontend to communicate with the backend
  app.enableCors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Allow cookies or authentication headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
