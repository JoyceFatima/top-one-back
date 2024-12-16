import { DataSourceOptions } from 'typeorm';

import { config } from '@/config';

const {
  database: { databaseUrl },
} = config;

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  entities: ['dist/entities/**/**/*.entity{.ts,.js}'],
  migrations: ['dist/common/database/migrations/*.{ts,js}'],
};

export const seedDatabaseConfig: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  entities: ['src/entities/**/**/*.entity{.ts,.js}'],
  migrations: ['src/common/database/migrations/*.{ts,js}'],
};
