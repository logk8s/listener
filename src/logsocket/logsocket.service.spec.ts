import { Test, TestingModule } from '@nestjs/testing';
import { LogsocketService } from './logsocket.service';

describe('LogsocketService', () => {
  let service: LogsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsocketService],
    }).compile();

    service = module.get<LogsocketService>(LogsocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
