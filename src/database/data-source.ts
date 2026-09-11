import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { env } from '../config/env';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.user,
  password: env.database.password,
  database: env.database.name,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
});
