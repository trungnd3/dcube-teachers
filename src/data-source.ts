import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const environment = process.env.NODE_ENV || 'production';

export const dataSourceOptions: MysqlConnectionOptions = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  logging: true,
  synchronize: false,
};

switch (environment) {
  case 'development':
    Object.assign(dataSourceOptions, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      entities: ['dist/**/*.entity.js'],
      migrationRun: true,
      synchronize: true,
    });
    break;
  case 'test':
    Object.assign(dataSourceOptions, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      entities: ['dist/**/*.entity.js'],
    });
    break;
  case 'production':
    Object.assign(dataSourceOptions, {
      entities: ['dist/**/*.entity.js'],
      extra: {
        socketPath: process.env.INSTANCE_CONNECTION_PATH, // Cloud SQL Unix socket
      },
    });
    break;
  default:
    break;
}

export const connectionSource = new DataSource(dataSourceOptions);
connectionSource.initialize();
