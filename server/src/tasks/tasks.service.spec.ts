import { TasksService } from './tasks.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TasksService', () => {
	let service: TasksService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TasksService]
		}).compile();

		service = module.get<TasksService>(TasksService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
