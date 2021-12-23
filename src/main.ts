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
  app.useWebSocketAdapter(new SocketIoAdapter(app,  'http://localhost'));
  //app.useWebSocketAdapter(new IoAdapter(app) as any);
  //app.useWebSocketAdapter(new WsAdapter(app) as any);
  app.enableCors({
    origin: 'http://localhost:57556',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
