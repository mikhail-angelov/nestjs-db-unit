# nestjs-db-unit

![Test](https://github.com/mikhail-angelov/nestjs-db-unit/workflows/Test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/mikhail-angelov/nestjs-db-unit/badge.svg?branch=master)](https://coveralls.io/github/mikhail-angelov/nestjs-db-unit?branch=master)

This util is designed to simplify integration tests for `nestjs`/`typeorm`/`postgres` projects
it replace postgres DB connection with sqlite in memory DB for test environment

## Usage

Starting `v3.0.0` the main usage for this library is changed, we do not need custom annotations any more and no need include into prod code.
Since `sqlite` and `postgres` have different sets of data type and `typeorm` does not support easy way to redefine those types for test environment, so this lib patch `typeorm` annotations, wrappers for `@Column`, `@CreateDateColumn`, `@UpdateDateColumn` etc... annotations.
There are some restriction:
- you have to use `commonjs` modules for successful library patch: in `tsconfig.json`
```
...
{
    "compilerOptions": {
        "module": "commonjs",
     }
}
...
```
- import `nestjs-db-unit` at very top of your tests (you have to patch `typeorm` first)
```
import { DbUnit } from 'nestjs-db-unit';
...
```

### Example
```ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('email')
  @Column({ unique: true})
  email!: string;

  @Column({type: 'json', nullable: true})
  meta!: object;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
```

This is example of service under test:

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(id: string) {
    return this.userRepository.findOne(id);
  }
}
```

This is example of test:

```ts
import { DbUnit } from 'nestjs-db-unit'; //on top
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { AppService } from './app.service';
import { User } from './entities/users';

const data = {
    User: [{
       id: 'test',
       email: 'test@test.com' 
    }]
}
describe('AppController', () => {
  let service: AppService;
  let db = new DbUnit();
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const conn = await db.initDb({ entities: [User] });
    userRepo = getRepository(User);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        {
          provide: getRepositoryToken(User, conn),
          useValue: userRepo,
        },
        AppService,
      ],
    }).compile();
    await db.load(data)

    service = app.get<AppService>(AppService);
  });
  afterEach(() => db.closeDb());
  afterAll(()=>db.exitDb()) //optional

  it('should get user"', async () => {
    const ID = 'test'
    const user = await service.getUser(ID);
    expect(user.email).toEqual('test@test.com');
  });
});

```

## Installation

```bash
npm i nestjs-db-unit
```

## API

### DbUnit - utility class
```ts
import {DbUnit} from 'nestjs-db-unit'
```
- constructor(options?: Options)

  `options` could be `{debug:true}` *optional*

  it used to add more logs from DB

- DbUnit::initDb(config)

  `config` mandatory param, it should contain list of entities, e.g. `{entities: [User]}`

  it returns `Promise` resolved as DB connection

- DbUnit::closeDb()

  initialize DB connection (clean sqlite in-memory DB)

- DbUnit::exitDb()

  close DB connection (close sqlite in-memory DB)

- DbUnit::load(data)

  it load data into DB

  data format must be like this:
  ```
  {
      <Entity1 name>:[
          <entity1_1 data>,
          <entity1_2 data>,
      ],
      <Entity2 name>:[
          <entity2_1 data>,
          <entity2_2 data>,
      ]
  }
  ```

  the data schema support relations, you can specify entity id and use it in followup entity data

You can find more examples for Integration and End to End tests at `/test` folder

License
----

MIT