import { DataSource } from 'typeorm';
import { databaseConfig } from './database-config';

export const AppDataSource = new DataSource({
  ...databaseConfig,
  entities: ['src/entities/**/**/*.entity{.ts,.js}'],
  migrations: ['src/common/database/migrations/*.{ts,js}'],
});
