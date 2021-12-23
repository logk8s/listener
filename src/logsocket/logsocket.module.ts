import { Module } from '@nestjs/common';
import { LogsocketService } from './logsocket.service';

@Module({
  providers: [LogsocketService]
})
export class LogsocketModule {}
