import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { networkInterfaces } from 'os';

function getLocalIpAddress(): string | null {
  const nets = networkInterfaces();
  for (const interfaceName of Object.keys(nets)) {
    const netInterface = nets[interfaceName];
    if (!netInterface) continue;

    for (const net of netInterface) {
      // Skip internal (loopback) and IPv6 addresses
      if (!net.internal && net.family === 'IPv4') {
        return net.address;
      }
    }
  }
  return null;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Enable CORS for frontend communication
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow cookies and authorization headers
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
    ],
    exposedHeaders: ['Authorization'],
    maxAge: 3600, // Cache preflight request for 1 hour
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Enable global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  const port = process.env.PORT || 3000;
  // Listen on all interfaces instead of just localhost
  await app.listen(port, '0.0.0.0');

  // Get the local IP address for better visibility
  const localIp = getLocalIpAddress();
  const url = `http://localhost:${port}`;
  const networkUrl = localIp ? `http://${localIp}:${port}` : null;

  // Log server start information
  Logger.log(`Server is running on port ${port}`, 'Bootstrap');
  Logger.log(`Local: ${url}`, 'Bootstrap');
  if (networkUrl) {
    Logger.log(`Network: ${networkUrl}`, 'Bootstrap');
  }
}

bootstrap();
