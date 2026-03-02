import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCallsService } from './service-calls.service';

describe('ServiceCallsService', () => {
  let service: ServiceCallsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceCallsService],
    }).compile();

    service = module.get<ServiceCallsService>(ServiceCallsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
