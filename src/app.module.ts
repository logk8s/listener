import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsocketModule } from './logsocket/logsocket.module';
import { LogsocketGateway } from './logsocket.gateway';

@Module({
  imports: [LogsocketModule],
  controllers: [AppController],
  providers: [AppService, LogsocketGateway],
})
export class AppModule {}
