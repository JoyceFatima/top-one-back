import { config } from 'src/config';
import { DataSourceOptions } from 'typeorm';

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
