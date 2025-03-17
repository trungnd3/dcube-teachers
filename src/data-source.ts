import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const dataSourceOptions: MysqlConnectionOptions = {
  type: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
  extra: {
    socketPath: process.env.INSTANCE_CONNECTION_PATH, // Cloud SQL Unix socket
  },
};

export const connectionSource = new DataSource(dataSourceOptions);
connectionSource.initialize();
