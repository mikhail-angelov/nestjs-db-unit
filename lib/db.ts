import { createConnection, ConnectionOptions, getConnection } from 'typeorm';

export const sqliteOptions = {
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  keepConnectionAlive: true,
};

interface Options {
  debug?: boolean;
}

type EntityType<T> = { [P in keyof T]: T[P] };
type EntitiesCollection<T> = { [P in keyof T]: Partial<EntityType<T[P]>>[] };

export class DbUnit {
  private log = false;
  private conn = null;
  constructor(options?: Options) {
    this.log = !!options?.debug;
    if (this.log) {
      console.log('new DbUnit');
    }
  }
  async initDb(config: Partial<ConnectionOptions>) {
    const opts = {
      ...config,
      ...(this.log ? { logging: true } : {}),
      ...sqliteOptions,
    } as ConnectionOptions;
    if (!this.conn) {
      this.conn = await createConnection(opts);
    }
    return this.conn;
  }
  async closeDb() {
    return this.conn?.synchronize(true);
  }
  async exitDb() {
    await this.conn?.close();
    this.conn = null;
  }
  async load(data: any) {
    const conn = await getConnection();
    for (let table of Object.keys(data)) {
      if(!data[table] || !(data[table].length > 0)){
        continue
      }
      //I have to deep copy db data, because rep.insert modify input data in place
      const copiedData = data[table].map(item=>Object.assign({},item))
      const rep = conn.getRepository(table);
      await rep.insert(copiedData);
      this.log && console.log('DB loaded: ', table, data[table].length);
    }
  }

  safeLoad<T>(data: EntitiesCollection<T>) {
    return this.load(data);
  }
}
