import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
  let playersController: PlayersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [PlayersService],
    }).compile();

    playersController = app.get<PlayersController>(PlayersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(playersController.getHello()).toBe('Hello World!');
    });
  });
});
