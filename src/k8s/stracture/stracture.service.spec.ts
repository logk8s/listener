import { Test, TestingModule } from '@nestjs/testing';
import { StractureService } from './stracture.service';

describe('K8s.StractureService', () => {
  let service: StractureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StractureService],
    }).compile();

    service = module.get<StractureService>(StractureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
