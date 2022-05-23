
import { expect } from 'chai'
import { DbUnit } from '../../dist';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';

import { getRepository, Repository } from 'typeorm';
import { User } from './entities/users';
import { Role } from './entities/roles';
import { Place } from './entities/places';


describe('AppController', () => {

  let appController: AppController;
  let db = new DbUnit();
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let placeRepo: Repository<Place>;

  beforeEach(async () => {
    const conn = await db.initDb({ entities: [User, Role, Place] });
    userRepo = getRepository(User);
    roleRepo = getRepository(Role);
    placeRepo = getRepository(Place);
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
        {
          provide: getRepositoryToken(Place, conn),
          useValue: placeRepo,
        },
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(() => db.closeDb());

  it('should return "Hello World!"', () => {
    expect(appController.getHello()).equal('Hello World!');
  });
});
