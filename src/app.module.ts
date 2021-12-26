import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsocketModule } from './logsocket/logsocket.module';
import { LogsocketGateway } from './logsocket.gateway';
import { StractureService } from './k8s/stracture/stracture.service';
import { FetcherService } from './k8s/fetcher/fetcher.service';

@Module({
  imports: [LogsocketModule],
  controllers: [AppController],
  providers: [AppService, LogsocketGateway, StractureService, FetcherService],
})
export class AppModule {}
