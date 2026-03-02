import { Test, TestingModule } from '@nestjs/testing';
import { WorkUpdatesController } from './work-updates.controller';

describe('WorkUpdatesController', () => {
  let controller: WorkUpdatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkUpdatesController],
    }).compile();

    controller = module.get<WorkUpdatesController>(WorkUpdatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
