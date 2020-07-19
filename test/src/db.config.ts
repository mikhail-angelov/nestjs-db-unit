import { DefaultNamingStrategy, ConnectionOptions } from 'typeorm';
import { sqliteOptions } from '../../dist';

const isTestEnv = process.env.NODE_ENV === 'test';
const connectionOptions = isTestEnv
  ? sqliteOptions
  : {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs-db-unit',
      synchronize: true,
    };
const dbConfig = {
  ...connectionOptions,
  namingStrategy: new DefaultNamingStrategy(),
  entities: [__dirname + '/entities/**/*.{ts,js}'],
  migrations: [__dirname + '/migrations/**/*.{ts,js}'],
};

export default dbConfig as ConnectionOptions;
