import { Column, ColumnOptions, ColumnType, CreateDateColumn, UpdateDateColumn } from 'typeorm';

const postgresSqliteTypeMapping: { [key: string]: ColumnType } = {
  timestamptz: 'datetime',
  timestamp: 'datetime',
  json: 'simple-json',
};

function setAppropriateColumnType(mySqlType: ColumnType): ColumnType {
  const isTestEnv = process.env.NODE_ENV === 'test';
  if (isTestEnv && mySqlType in postgresSqliteTypeMapping) {
    return postgresSqliteTypeMapping[mySqlType.toString()];
  }
  return mySqlType;
}

export function ColumnEx(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = setAppropriateColumnType(columnOptions.type);
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
