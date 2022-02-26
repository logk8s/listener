import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { IoAdapter } from '@nestjs/platform-socket.io';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const grpc_app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: "localhost:5000",
      package: 'logs',
      protoPath: join(__dirname, 'grpc/cluster.proto'),
    },
  });
  grpc_app.listen();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors();
  //app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useWebSocketAdapter(new IoAdapter(app) as any);
  await app.listen(3000);
}
bootstrap();
