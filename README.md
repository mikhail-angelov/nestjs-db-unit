# nestjs-db-unit

![Test](https://github.com/mikhail-angelov/nestjs-db-unit/workflows/Test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/mikhail-angelov/nestjs-db-unit/badge.svg?branch=master)](https://coveralls.io/github/mikhail-angelov/nestjs-db-unit?branch=master)

This util is designed to simplify integration tests for `nestjs`/`typeorm`/`postgres` projects
it replace postgres DB connection with sqlite in memory DB for test environment

## Usage

Since `sqlite` and `postgres` have different sets of data type and `typeorm` does not support easy way to redefine those types for test environment, so this lib contains wrappers for `@Column`, `@CreateDateColumn`, `@UpdateDateColumn` annotations.
If your entity contains incompatible with `sqlite` fields, then you should use those wrappers:

```ts
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import {CreateDateColumnEx, UpdateDateColumnEx, ColumnEx} from 'nestjs-db-unit'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('email')
  @Column({ unique: true})
  email!: string;

  @ColumnEx({type: 'json', nullable: true})
  meta!: object;

  @CreateDateColumnEx({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumnEx({ name: 'updated_at', type: 'timestamptz' })
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
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { DbUnit } from 'nestjs-db-unit';
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

### annotations
```ts
import {CreateDateColumnEx, UpdateDateColumnEx, ColumnEx} from 'nestjs-db-unit'
```
they wrap `CreateDateColumn`, `UpdateDateColumn`, `Column` respectively
you should use `ColumnEx` instead of `Column` if it has types: `timestamptz`, `timestamp`, `json`, `enum`
> the list could be extended in future

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

  close DB connection (clean sqlite in-memory DB)

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