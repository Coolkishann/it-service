import { Test, TestingModule } from '@nestjs/testing';
import { WorkUpdatesService } from './work-updates.service';

describe('WorkUpdatesService', () => {
  let service: WorkUpdatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkUpdatesService],
    }).compile();

    service = module.get<WorkUpdatesService>(WorkUpdatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
