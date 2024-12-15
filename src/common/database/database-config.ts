import { DataSourceOptions } from 'typeorm';

import { config } from '@/config';

const {
  database: { host, user, port, pass, name },
} = config;

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: host,
  username: user,
  port: parseInt(port),
  password: pass,
  database: name,
  entities: ['dist/entities/**/**/*.entity{.ts,.js}'],
  migrations: ['dist/common/database/migrations/*.{ts,js}'],
};

export const seedDatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: host,
  username: user,
  port: parseInt(port),
  password: pass,
  database: name,
  entities: ['src/entities/**/**/*.entity{.ts,.js}'],
  migrations: ['src/common/database/migrations/*.{ts,js}'],
};
