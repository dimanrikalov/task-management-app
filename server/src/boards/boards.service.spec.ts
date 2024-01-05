import { BoardsService } from './boards.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('BoardsService', () => {
    let service: BoardsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BoardsService]
        }).compile();

        service = module.get<BoardsService>(BoardsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
