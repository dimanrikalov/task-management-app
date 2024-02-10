import { StepsService } from './steps.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('StepsService', () => {
	let service: StepsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [StepsService]
		}).compile();

		service = module.get<StepsService>(StepsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
