import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository, getRepository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { DbUnit } from '../../dist';
import { User } from '../src/entities/users';
import { Role } from '../src/entities/roles';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let db = new DbUnit();
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    roleRepo = getRepository(Role);
    userRepo = getRepository(User);
  });

  afterAll(() => app.close());

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('should load data to db', async () => {
    await db.load({
      Role: [
        {
          id: 'any',
          name: 'test',
        },
      ],
      User: [
        {
          email: 'test',
          roleId: 'any',
        },
      ],
    });
    const users = await userRepo.find({});
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test');
  });
});
