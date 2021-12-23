import { Test, TestingModule } from '@nestjs/testing';
import { LogsocketGateway } from './logsocket.gateway';

describe('LogsocketGateway', () => {
  let gateway: LogsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsocketGateway],
    }).compile();

    gateway = module.get<LogsocketGateway>(LogsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
