import { DataSource, DataSourceOptions } from 'typeorm';

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: 'db',
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   entities: ['src/**/*.entity{.ts,.js}'],
//   migrations: ['migrations/*{.ts,.js}'],
//   migrationsTableName: 'migrations',
//   synchronize: false,
//   logging: true,
// };

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  username: 'dcube',
  password: 'dcube',
  url: 'mysql://dcube:dcube@db:3306/dcube',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
};

export const connectionSource = new DataSource(dataSourceOptions);
connectionSource.initialize();

// switch (process.env.NODE_ENV) {
//   case 'development':
//     break;
//   case 'test':
//     Object.assign(dataSourceOptions, {
//       migrationsRun: true,
//     });
//     break;
//   case 'production':
//     Object.assign(dataSourceOptions, {
//       migrationsRun: true,
//     });
//     break;
//   default:
//     throw new Error('no environment detected.');
// }

// dataSource.initialize();
