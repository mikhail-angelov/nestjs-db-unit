import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { DbUnit } from '../../dist';
import { getRepository, Repository } from 'typeorm';
import { User } from './entities/users';
import { Role, RoleCode } from './entities/roles';
import { Place } from './entities/places';
import data from '../fixtures/data';

describe('AppService', () => {
  let service: AppService;
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
      controllers: [],
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
    await db.load(data);

    service = app.get<AppService>(AppService);
  });
  afterEach(() => db.closeDb());
  afterAll(()=>db.exitDb()) //optional

  it('should get user"', async () => {
    const ID = data.User[0].id;
    const user = await service.getUser(ID);
    expect(user.email).toEqual('test-email');
    expect(user.meta).toEqual({ field1: 1, field2: 2 });
  });

  it('should create user"', async () => {
    const user = await service.createUser({
      role: { name: 'test', code: RoleCode.admin },
      user: { email: 'test' },
    });
    expect(user.email).toEqual('test');
  });

  it('should update user"', async () => {
    const ID = data.User[0].id;
    let user = await service.getUser(ID);
    expect(user.email).toEqual('test-email');
    expect(user.meta).toEqual({ field1: 1, field2: 2 });

    user = await service.updateUser(ID, { email: 'new', meta: { test: 42 } });
    expect(user.email).toEqual('new');
    expect(user.meta).toEqual({ test: 42 });
  });

  it('should remove user"', async () => {
    const ID = data.User[0].id;
    let users = await userRepo.find();
    expect(users.length).toEqual(1);

    await service.removeUser(ID);
    users = await userRepo.find();
    expect(users.length).toEqual(0);
  });

  it('should get places"', async () => {
    let places = await service.getPlaces();
    expect(places.length).toEqual(1);
    expect(places[0].point.type).toEqual('Point');
  });
});
