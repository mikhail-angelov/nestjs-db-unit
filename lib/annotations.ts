import {
  Column,
  ColumnOptions,
  ColumnType,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';

if (typeof jest !== 'undefined') {
  jest.mock('typeorm', () => {
    const typeorm = jest.requireActual('typeorm');
    return {
      ...typeorm,
      Generated: GeneratedEx,
      Column: ColumnEx,
      CreateDateColumn: CreateDateColumnEx,
      UpdateDateColumn: UpdateDateColumnEx,
      DeleteDateColumn: DeleteDateColumnEx,
      ManyToMany: ManyToManyEx,
    };
  });
} else {
  const Module = require('module');
  const originalLoad = Module._load;
  let typeorm;
  const fakeLoad = function (request, parent, isMain) {
    if (request == 'typeorm') {
      if (!typeorm) {
        typeorm = originalLoad(request, parent, isMain);
      }
      return {
        ...typeorm,
        Generated: GeneratedEx,
        Column: ColumnEx,
        CreateDateColumn: () => CreateDateColumnEx,
        UpdateDateColumn: () => UpdateDateColumnEx,
        DeleteDateColumn: () => DeleteDateColumnEx,
        ManyToMany: () => ManyToManyEx,
      };
    }
    return originalLoad(request, parent, isMain);
  };
  Module._load = fakeLoad;
}

const postgresSqliteTypeMapping: { [key: string]: ColumnType } = {
  timestamptz: 'datetime',
  timestamp: 'datetime',
  json: 'simple-json',
  enum: 'text',
  bytea: 'text',
};

const isTestEnv = () => process.env.NODE_ENV === 'test';

function setAppropriateColumnType(mySqlType: ColumnType): ColumnType {
  if (isTestEnv() && Object.keys(postgresSqliteTypeMapping).includes(mySqlType.toString())) {
    return postgresSqliteTypeMapping[mySqlType.toString()];
  }
  return mySqlType;
}

export function ColumnEx(columnOptions: ColumnOptions) {
  if (columnOptions?.type) {
    columnOptions.type = setAppropriateColumnType(columnOptions.type);
  }
  if (columnOptions?.type === 'geography' && isTestEnv()) {
    return Column({
      type: 'text',
      transformer: { from: (value: string) => JSON.parse(value), to: (value: any) => JSON.stringify(value) },
    });
  }
  return Column(columnOptions);
}

export function CreateDateColumnEx(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = setAppropriateColumnType(columnOptions.type);
  }
  return CreateDateColumn(columnOptions);
}
export function UpdateDateColumnEx(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = setAppropriateColumnType(columnOptions.type);
  }
  return UpdateDateColumn(columnOptions);
}

export function GeneratedEx(strategy) {
  if (isTestEnv()) {
    return Generated('uuid');
  }
  return Generated(strategy);
}

export function DeleteDateColumnEx(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = setAppropriateColumnType(columnOptions.type);
  }
  return DeleteDateColumn(columnOptions);
}

export function ManyToManyEx(arg1, arg2) {
  if (isTestEnv()) {
    //ignore it for test
    return Generated('uuid');
  }
  return ManyToMany(arg1, arg2);
}
