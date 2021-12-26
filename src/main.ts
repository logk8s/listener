import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketIoAdapter } from './utils/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors();
  //app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useWebSocketAdapter(new IoAdapter(app) as any);
  await app.listen(3000);
}
bootstrap();
