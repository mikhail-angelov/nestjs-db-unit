import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { DbUnit } from '../../dist';
import { getRepository, Repository } from 'typeorm';
import { User } from './entities/users';
import { Role } from './entities/roles';

describe('AppController', () => {
  let appController: AppController;
  let db = new DbUnit();
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;

  beforeAll(async () => {
    const conn = await db.initDb({ entities: [User, Role] });
    userRepo = getRepository(User);
    roleRepo = getRepository(Role);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: getRepositoryToken(User, conn),
          useValue: userRepo,
        },
        {
          provide: getRepositoryToken(Role, conn),
          useValue: roleRepo,
        },
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterAll(() => db.closeDb());

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
